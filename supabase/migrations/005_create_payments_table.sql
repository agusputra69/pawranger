-- Create payments table for tracking payment transactions

CREATE TABLE IF NOT EXISTS public.payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
  payment_number TEXT UNIQUE NOT NULL,
  amount DECIMAL(12,2) NOT NULL CHECK (amount > 0),
  currency TEXT DEFAULT 'IDR',
  payment_method TEXT NOT NULL CHECK (payment_method IN ('credit_card', 'debit_card', 'bank_transfer', 'e_wallet', 'cash', 'qris')),
  payment_provider TEXT, -- e.g., 'midtrans', 'xendit', 'stripe'
  provider_transaction_id TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded')),
  payment_type TEXT NOT NULL CHECK (payment_type IN ('order', 'booking', 'refund')),
  description TEXT,
  metadata JSONB, -- Store additional payment gateway data
  gateway_response JSONB, -- Store payment gateway response
  paid_at TIMESTAMP WITH TIME ZONE,
  failed_at TIMESTAMP WITH TIME ZONE,
  failure_reason TEXT,
  refunded_at TIMESTAMP WITH TIME ZONE,
  refund_amount DECIMAL(12,2) DEFAULT 0 CHECK (refund_amount >= 0),
  refund_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure either order_id or booking_id is provided, but not both
  CONSTRAINT check_payment_reference CHECK (
    (order_id IS NOT NULL AND booking_id IS NULL) OR
    (order_id IS NULL AND booking_id IS NOT NULL)
  )
);

-- Create indexes for better performance
CREATE INDEX idx_payments_user_id ON public.payments(user_id);
CREATE INDEX idx_payments_order_id ON public.payments(order_id);
CREATE INDEX idx_payments_booking_id ON public.payments(booking_id);
CREATE INDEX idx_payments_status ON public.payments(status);
CREATE INDEX idx_payments_payment_method ON public.payments(payment_method);
CREATE INDEX idx_payments_payment_type ON public.payments(payment_type);
CREATE INDEX idx_payments_provider_transaction_id ON public.payments(provider_transaction_id);
CREATE INDEX idx_payments_created_at ON public.payments(created_at);
CREATE INDEX idx_payments_paid_at ON public.payments(paid_at);
CREATE INDEX idx_payments_payment_number ON public.payments(payment_number);

-- Enable Row Level Security
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Create policies for payments table
-- Users can view their own payments
CREATE POLICY "Users can view own payments" ON public.payments
  FOR SELECT USING (auth.uid() = user_id);

-- Users can create their own payments
CREATE POLICY "Users can create own payments" ON public.payments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own pending payments
CREATE POLICY "Users can update own pending payments" ON public.payments
  FOR UPDATE USING (auth.uid() = user_id AND status = 'pending');

-- Admins can view all payments
CREATE POLICY "Admins can view all payments" ON public.payments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admins can update all payments
CREATE POLICY "Admins can update all payments" ON public.payments
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create function to generate payment number
CREATE OR REPLACE FUNCTION public.generate_payment_number()
RETURNS TEXT AS $$
DECLARE
  payment_num TEXT;
BEGIN
  payment_num := 'PAY-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(NEXTVAL('payment_number_seq')::TEXT, 6, '0');
  RETURN payment_num;
END;
$$ LANGUAGE plpgsql;

-- Create sequence for payment numbers
CREATE SEQUENCE IF NOT EXISTS payment_number_seq START 1;

-- Create trigger to auto-generate payment number
CREATE OR REPLACE FUNCTION public.set_payment_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.payment_number IS NULL THEN
    NEW.payment_number := public.generate_payment_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_payment_number_trigger
  BEFORE INSERT ON public.payments
  FOR EACH ROW EXECUTE FUNCTION public.set_payment_number();

-- Create trigger to update updated_at column
CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON public.payments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to update order/booking payment status
CREATE OR REPLACE FUNCTION public.update_payment_status()
RETURNS TRIGGER AS $$
BEGIN
  -- Update order payment status if this is an order payment
  IF NEW.order_id IS NOT NULL THEN
    UPDATE public.orders
    SET payment_status = CASE
      WHEN NEW.status = 'completed' THEN 'paid'
      WHEN NEW.status = 'failed' THEN 'failed'
      WHEN NEW.status = 'refunded' THEN 'refunded'
      ELSE 'pending'
    END,
    updated_at = NOW()
    WHERE id = NEW.order_id;
  END IF;
  
  -- Update booking payment status if this is a booking payment
  IF NEW.booking_id IS NOT NULL THEN
    UPDATE public.bookings
    SET payment_status = CASE
      WHEN NEW.status = 'completed' THEN 'paid'
      WHEN NEW.status = 'failed' THEN 'failed'
      WHEN NEW.status = 'refunded' THEN 'refunded'
      ELSE 'pending'
    END,
    updated_at = NOW()
    WHERE id = NEW.booking_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update related order/booking payment status
CREATE TRIGGER update_related_payment_status_trigger
  AFTER UPDATE ON public.payments
  FOR EACH ROW
  WHEN (OLD.status IS DISTINCT FROM NEW.status)
  EXECUTE FUNCTION public.update_payment_status();

-- Grant permissions
GRANT ALL PRIVILEGES ON public.payments TO authenticated;
GRANT USAGE ON SEQUENCE payment_number_seq TO authenticated;