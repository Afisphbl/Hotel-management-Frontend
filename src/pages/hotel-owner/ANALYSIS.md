# Hotel Owner Backend Analysis

## Overview
The backend provides comprehensive functionality for hotel owners to manage all aspects of their hotel operations. Below is a detailed analysis of available features.

## Available Backend Endpoints & Functionality

### 1. Dashboard (`/hotel/dashboard`)
- **GET /hotel/dashboard** - Get comprehensive dashboard data
- **Features**: Overview metrics, KPIs, charts, and activity feeds
- **Frontend Page**: Dashboard.tsx

### 2. Bookings Management (`/hotel/bookings`)
- **GET /hotel/bookings** - List all bookings with pagination and filters
  - Filters: status, guestId, dateFrom, dateTo
  - Statuses: PENDING, CONFIRMED, CANCELLED, CHECKED_IN, CHECKED_OUT
- **GET /hotel/bookings/:id** - Get booking details
- **POST /hotel/bookings** - Create new booking
  - Required: guestId, roomIds, checkIn, checkOut, idempotencyKey
- **POST /hotel/bookings/:id/confirm** - Confirm a booking
- **POST /hotel/bookings/:id/cancel** - Cancel a booking with reason
- **POST /hotel/bookings/:id/checkin** - Check guest in
- **POST /hotel/bookings/:id/checkout** - Check guest out
- **Frontend Page**: Bookings.tsx

### 3. Payments Processing (`/hotel/payments`)
- **GET /hotel/payments** - List all payments with filters
  - Filters: status, invoiceId, method
  - Methods: CREDIT_CARD, BANK_TRANSFER, CASH, ONLINE_WALLET
- **GET /hotel/payments/:id** - Get payment details
- **POST /hotel/payments** - Process payment
  - Required: invoiceId, amount, method, idempotencyKey
  - Optional: transactionId, gatewayResponse
- **POST /hotel/payments/:id/refund** - Issue refund
  - Required: amount, reason, idempotencyKey
  - Reasons: GUEST_REQUEST, CANCELLATION, ERROR, OTHER
- **GET /hotel/payments/:id/refunds** - Get refunds for a payment
- **Frontend Page**: Payments.tsx

### 4. Room Management (`/hotel/rooms`)
- **GET /hotel/rooms** - List all rooms with pagination
  - Filters: status, floor, roomTypeId
  - Statuses: AVAILABLE, OCCUPIED, MAINTENANCE, BLOCKED
- **GET /hotel/rooms/availability** - Get room availability
- **GET /hotel/rooms/:id** - Get room details
- **POST /hotel/rooms** - Create new room (with plan limit check)
- **PATCH /hotel/rooms/:id** - Update room
- **DELETE /hotel/rooms/:id** - Delete room
- **Frontend Page**: Rooms.tsx

### 5. Staff Management (`/hotel/staff`)
- **GET /hotel/staff** - List all staff with pagination
  - Filters: role, status, department
  - Roles: MANAGER, RECEPTIONIST, HOUSEKEEPER, MAINTENANCE, CHEF, WAITER, OTHER
  - Statuses: ACTIVE, INACTIVE, ON_LEAVE
- **GET /hotel/staff/:id** - Get staff details
- **POST /hotel/staff** - Add new staff (with plan limit check)
- **PATCH /hotel/staff/:id** - Update staff information
- **DELETE /hotel/staff/:id** - Remove staff
- **Frontend Page**: Staff.tsx

### 6. Pricing Management (`/hotel/pricing`)
- **POST /hotel/pricing/overrides** - Create price override
- **DELETE /hotel/pricing/overrides/:id** - Delete price override
- **POST /hotel/pricing/promotions** - Create promotion
- **DELETE /hotel/pricing/promotions/:id** - Delete promotion
- **POST /hotel/pricing/seasonal-rates** - Create seasonal rates
- **DELETE /hotel/pricing/seasonal-rates/:id** - Delete seasonal rates
- **Frontend Page**: Pricing.tsx

### 7. Invoices Management (`/hotel/invoices`)
- **GET /hotel/invoices** - List invoices
  - Filters: status, bookingId
  - Statuses: DRAFT, ISSUED, PAID, CANCELLED, VOIDED
- **GET /hotel/invoices/:id** - Get invoice details
- **POST /hotel/invoices/:id/issue** - Issue an invoice
- **POST /hotel/invoices/:id/void** - Void an invoice
- **Frontend Page**: Invoices.tsx

### 8. Housekeeping (`/hotel/housekeeping`)
- **GET /hotel/housekeeping** - List housekeeping tasks
- **POST /hotel/housekeeping** - Create housekeeping task
- **PATCH /hotel/housekeeping/:id** - Update task status
- **Frontend Page**: Housekeeping.tsx

### 9. Maintenance (`/hotel/maintenance`)
- **GET /hotel/maintenance** - List maintenance tickets
- **POST /hotel/maintenance** - Create maintenance ticket
- **PATCH /hotel/maintenance/:id** - Update ticket status
- **Frontend Page**: Maintenance.tsx

### 10. Guests Management (`/hotel/guests`)
- **GET /hotel/guests** - List all guests
- **GET /hotel/guests/:id** - Get guest details
- **Frontend Page**: Guests.tsx

## Security & Access Control
- All endpoints protected by: JwtAuthGuard, ScopeGuard, TenantGuard, PermissionsGuard
- Requires UserScope.HOTEL
- Multi-tenant support built-in
- Plan limits enforced for room/staff creation

## Recommended Frontend Features
1. ✅ Dashboard - Real-time metrics and activity
2. ✅ Bookings - Full lifecycle management
3. ✅ Payments - Payment processing and refunds
4. ✅ Rooms - Inventory management
5. ✅ Staff - Team management
6. ✅ Pricing - Dynamic pricing strategies
7. ✅ Invoices - Financial documents
8. ✅ Housekeeping - Cleaning management
9. ✅ Maintenance - Facility management
10. ✅ Guests - Guest profiles
11. ✅ Reports - Analytics and insights

## Error Handling
All endpoints follow a consistent error response pattern with:
- Appropriate HTTP status codes
- Error messages
- Request tracking with idempotencyKey
