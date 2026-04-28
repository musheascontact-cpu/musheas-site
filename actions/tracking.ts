'use server';

import { getShippingTrackingInfo, ShippingTrackingOutput } from "@/ai/flows/shipping-tracking-flow";

export async function trackOrder(trackingNumber: string): Promise<ShippingTrackingOutput | null> {
    try {
        const trackingInfo = await getShippingTrackingInfo({ trackingNumber });
        return trackingInfo;
    } catch (error) {
        console.error("Error tracking order:", error);
        return null;
    }
}
