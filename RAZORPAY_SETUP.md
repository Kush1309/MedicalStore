# Razorpay Payment Gateway Setup Guide

## 🔐 Getting Your Razorpay API Keys

### Step 1: Create Razorpay Account
1. Go to [https://dashboard.razorpay.com/signup](https://dashboard.razorpay.com/signup)
2. Sign up with your email and phone number
3. Complete the verification process

### Step 2: Get Test API Keys
1. Login to [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Click on **Settings** (gear icon) in the left sidebar
3. Go to **API Keys** section
4. Click on **Generate Test Key** (for testing)
5. You'll see two keys:
   - **Key ID** (starts with `rzp_test_`)
   - **Key Secret** (keep this secret!)

### Step 3: Configure Your Application

1. Open the file: `backend/.env`
2. Replace the placeholder values with your actual keys:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/medical_store
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123

# Razorpay Payment Gateway
RAZORPAY_KEY_ID=rzp_test_YOUR_ACTUAL_KEY_ID_HERE
RAZORPAY_KEY_SECRET=YOUR_ACTUAL_KEY_SECRET_HERE
```

### Step 4: Restart the Server

After updating the `.env` file, restart your backend server:

```bash
# Stop the current server (Ctrl+C in the terminal)
# Then start it again:
cd backend
npm start
```

## 💳 Testing Payments

### Test Mode
Razorpay provides test mode for development. You can use test cards to simulate payments:

**Test Card Details:**
- **Card Number**: `4111 1111 1111 1111`
- **CVV**: Any 3 digits (e.g., `123`)
- **Expiry**: Any future date (e.g., `12/25`)
- **Name**: Any name

**Test UPI ID**: `success@razorpay`

**Test Wallets**: Select any wallet and it will simulate success

### Payment Flow
1. Customer adds items to cart
2. Proceeds to checkout
3. Selects "Pay Online (Razorpay)"
4. Fills in customer details
5. Clicks "Pay Now"
6. Razorpay payment modal opens
7. Customer completes payment
8. Order is created with payment confirmation

## 🚀 Going Live (Production)

### When Ready for Real Payments:

1. **Complete KYC** on Razorpay Dashboard
   - Submit business documents
   - Bank account details
   - Wait for approval (usually 24-48 hours)

2. **Generate Live Keys**
   - Go to Settings → API Keys
   - Switch to **Live Mode**
   - Generate Live Keys (starts with `rzp_live_`)

3. **Update .env File**
   - Replace test keys with live keys
   - Deploy your application

4. **Important**: Never commit `.env` file to Git!
   - Add `.env` to `.gitignore`
   - Keep your secret keys secure

## 📊 Payment Status Tracking

The system tracks:
- **Payment Status**: Pending, Completed, Failed, Refunded
- **Razorpay Order ID**: Unique order identifier
- **Razorpay Payment ID**: Unique payment identifier
- **Signature**: For payment verification

You can view all payment details in the admin dashboard under Orders.

## 🔒 Security Notes

1. **Never expose your Key Secret** in frontend code
2. Always verify payment signatures on the backend
3. Use HTTPS in production
4. Implement rate limiting
5. Log all payment transactions
6. Set up webhooks for payment notifications

## 💡 Features Included

✅ **Multiple Payment Methods**:
- Credit/Debit Cards
- UPI
- Net Banking
- Wallets (Paytm, PhonePe, etc.)

✅ **Payment Verification**: Server-side signature verification

✅ **Order Tracking**: Payment status linked to orders

✅ **Fallback**: Cash on Delivery still available

## 🆘 Troubleshooting

### "Payment initialization failed"
- Check if Razorpay keys are correctly set in `.env`
- Ensure backend server is running
- Check browser console for errors

### "Payment verification failed"
- Verify Key Secret is correct
- Check network connectivity
- Ensure payment was completed

### Test payments not working
- Confirm you're using test keys (rzp_test_)
- Use the provided test card numbers
- Check Razorpay dashboard for test mode

## 📞 Support

- **Razorpay Docs**: [https://razorpay.com/docs/](https://razorpay.com/docs/)
- **Razorpay Support**: [https://razorpay.com/support/](https://razorpay.com/support/)
- **Integration Guide**: [https://razorpay.com/docs/payment-gateway/web-integration/](https://razorpay.com/docs/payment-gateway/web-integration/)

---

## Quick Start (Without Real Keys)

If you don't want to set up Razorpay right now, the application still works perfectly with **Cash on Delivery**. Just select "Cash on Delivery" during checkout and orders will be created normally.

To enable online payments later, just follow the steps above to get your API keys!
