# API Documentation - Pawranger Website

## Overview

This document outlines the API structure and data flow for the Pawranger pet care services website. While the current implementation uses local state management, this documentation serves as a reference for future backend integration.

## Authentication API

### User Registration

**Endpoint:** `POST /api/auth/register`

**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "password": "string",
  "phone": "string"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "string",
    "name": "string",
    "email": "string",
    "phone": "string",
    "createdAt": "datetime"
  },
  "token": "string"
}
```

### User Login

**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "string",
    "name": "string",
    "email": "string",
    "phone": "string"
  },
  "token": "string"
}
```

## E-commerce API

### Get Products

**Endpoint:** `GET /api/products`

**Query Parameters:**
- `category` (optional): Filter by category
- `search` (optional): Search term
- `page` (optional): Page number
- `limit` (optional): Items per page
- `sortBy` (optional): Sort criteria

**Response:**
```json
{
  "success": true,
  "products": [
    {
      "id": "number",
      "name": "string",
      "category": "string",
      "price": "number",
      "originalPrice": "number",
      "rating": "number",
      "reviews": "number",
      "image": "string",
      "description": "string",
      "weight": "string",
      "brand": "string",
      "inStock": "boolean",
      "discount": "number",
      "tags": ["string"],
      "features": ["string"]
    }
  ],
  "pagination": {
    "currentPage": "number",
    "totalPages": "number",
    "totalItems": "number"
  }
}
```

### Create Order

**Endpoint:** `POST /api/orders`

**Request Body:**
```json
{
  "items": [
    {
      "productId": "number",
      "quantity": "number",
      "price": "number"
    }
  ],
  "customerInfo": {
    "name": "string",
    "email": "string",
    "phone": "string",
    "address": "string"
  },
  "paymentMethod": "string",
  "totalAmount": "number"
}
```

**Response:**
```json
{
  "success": true,
  "order": {
    "id": "string",
    "orderNumber": "string",
    "status": "pending",
    "totalAmount": "number",
    "createdAt": "datetime",
    "items": ["array"],
    "customerInfo": "object"
  }
}
```

## Booking API

### Create Booking

**Endpoint:** `POST /api/bookings`

**Request Body:**
```json
{
  "service": "string",
  "petName": "string",
  "petType": "string",
  "date": "date",
  "time": "string",
  "customerInfo": {
    "name": "string",
    "email": "string",
    "phone": "string"
  },
  "notes": "string"
}
```

**Response:**
```json
{
  "success": true,
  "booking": {
    "id": "string",
    "bookingNumber": "string",
    "status": "confirmed",
    "service": "string",
    "date": "date",
    "time": "string",
    "createdAt": "datetime"
  }
}
```

## Data Models

### User Model
```typescript
interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Product Model
```typescript
interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  description: string;
  weight: string;
  brand: string;
  inStock: boolean;
  discount?: number;
  tags: string[];
  features: string[];
}
```

### Order Model
```typescript
interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  items: OrderItem[];
  customerInfo: CustomerInfo;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'failed';
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

interface OrderItem {
  productId: number;
  quantity: number;
  price: number;
  subtotal: number;
}

interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
}
```

### Booking Model
```typescript
interface Booking {
  id: string;
  bookingNumber: string;
  userId?: string;
  service: string;
  petName: string;
  petType: string;
  date: Date;
  time: string;
  customerInfo: CustomerInfo;
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

## Error Handling

### Standard Error Response
```json
{
  "success": false,
  "error": {
    "code": "string",
    "message": "string",
    "details": "object (optional)"
  }
}
```

### Common Error Codes
- `VALIDATION_ERROR`: Invalid input data
- `AUTHENTICATION_REQUIRED`: User not authenticated
- `AUTHORIZATION_FAILED`: Insufficient permissions
- `RESOURCE_NOT_FOUND`: Requested resource doesn't exist
- `INTERNAL_SERVER_ERROR`: Server-side error

## Rate Limiting

- Authentication endpoints: 5 requests per minute
- Product endpoints: 100 requests per minute
- Order/Booking endpoints: 20 requests per minute

## Authentication

All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <token>
```

## Pagination

List endpoints support pagination with the following parameters:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 100)

Pagination response includes:
```json
{
  "pagination": {
    "currentPage": 1,
    "totalPages": 10,
    "totalItems": 100,
    "hasNext": true,
    "hasPrev": false
  }
}
```