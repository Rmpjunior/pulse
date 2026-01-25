# Keepo Clone - Features Specification

Based on research of [keepo.bio](https://keepo.bio), this document outlines all features to be implemented.

## Overview

Keepo is a "minisite" builder for social media bios (Instagram, TikTok). It centralizes links, products, and content into a single, professional mobile-optimized page.

**Value Proposition**: "Transform your bio into a minisite that converts"

---

## Core Features

### 1. Content Blocks/Sections

The page builder uses a modular block system. Each block type serves a specific purpose:

| Block Type       | Description                                | Free Tier | Plus Tier |
| ---------------- | ------------------------------------------ | --------- | --------- |
| **Links**        | Standard buttons for external URLs         | ✅        | ✅        |
| **Highlights**   | Card-based sections with images and text   | ✅        | ✅        |
| **Media**        | YouTube, Vimeo, Spotify, SoundCloud embeds | ✅        | ✅        |
| **Catalog**      | Product/service listings (mini e-commerce) | ✅        | ✅        |
| **Forms**        | Lead capture and contact forms             | ✅        | ✅        |
| **Social Icons** | Social media profile links                 | ✅        | ✅        |
| **Text**         | Rich text content blocks                   | ✅        | ✅        |

### 2. Page Customization

| Feature         | Free Tier  | Plus Tier     |
| --------------- | ---------- | ------------- |
| Profile picture | ✅         | ✅            |
| Display name    | ✅         | ✅            |
| Bio text        | ✅         | ✅            |
| Color palettes  | 10 presets | Custom colors |
| Section limit   | 5 sections | Unlimited     |
| Font selection  | Limited    | Extended      |

### 3. Analytics (Plus Tier)

- Page views tracking
- Click tracking per block
- Conversion tracking
- Time-based analytics (daily, weekly, monthly)
- Geographic data (optional)

### 4. Domain & Branding

| Feature                      | Free Tier | Plus Tier |
| ---------------------------- | --------- | --------- |
| Subdomain (app.com/username) | ✅        | ✅        |
| Custom domain                | ❌        | ✅        |
| "Made with Keepo" watermark  | Always    | Removable |

### 5. User Management

- Email/password registration
- Social login (Google, optional: Apple, Facebook)
- Profile management
- Password reset
- Account deletion

---

## Pricing Tiers

### Free Tier (R$0)

- Up to 5 content sections
- 10 color combinations
- Basic customization
- Watermark displayed

### Plus Tier

- **Annual**: R$9,90/month (billed R$119,90/year)
- **Monthly**: R$15,90/month
- Features:
  - Unlimited sections
  - Custom colors
  - Analytics dashboard
  - Custom domain
  - No watermark

---

## Technical Integrations

### Payment Processing

- **Stripe** for subscription management
- Webhook handling for subscription events

### Content Embeds

- YouTube/Vimeo video embeds
- Spotify/SoundCloud audio embeds
- (Future: TikTok, Instagram posts)

### Social Connections

- Instagram profile linking
- TikTok profile linking
- Twitter/X profile linking
- LinkedIn profile linking
- GitHub profile linking
- Custom URL links

---

## Design Philosophy

1. **Mobile-First**: All editing and viewing optimized for mobile
2. **Visual Style**: Clean, modern, card-based with rounded corners
3. **Color Palette**: Primary colors are purple and orange with dark/light themes
4. **Fast Loading**: Optimized for quick page loads
5. **Accessibility**: WCAG compliance considerations

---

## User Flows

### 1. Registration Flow

1. Landing page → Sign Up button
2. Email/password or social login
3. Choose username (unique URL slug)
4. Complete profile (name, bio, photo)
5. Start building page

### 2. Page Building Flow

1. Dashboard → Edit Page
2. Add blocks via + button
3. Drag to reorder blocks
4. Configure each block
5. Preview changes
6. Save & publish

### 3. Subscription Flow

1. Free user → Upgrade button
2. View pricing comparison
3. Select plan (monthly/annual)
4. Stripe checkout
5. Confirmation & feature unlock

---

## Example Page Structure

```
┌─────────────────────────────┐
│      Profile Picture        │
│         @username           │
│     Short bio text here     │
├─────────────────────────────┤
│    [Social Icons Row]       │
├─────────────────────────────┤
│  ┌─────────────────────┐   │
│  │   Link Button 1     │   │
│  └─────────────────────┘   │
│  ┌─────────────────────┐   │
│  │   Link Button 2     │   │
│  └─────────────────────┘   │
├─────────────────────────────┤
│  ┌─────────┐ ┌─────────┐   │
│  │Highlight│ │Highlight│   │
│  │  Card   │ │  Card   │   │
│  └─────────┘ └─────────┘   │
├─────────────────────────────┤
│   [Embedded Video Player]   │
├─────────────────────────────┤
│    Made with KeepoBio       │
└─────────────────────────────┘
```
