'use client';

import React, { useState } from 'react';
import { Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { trackOrder } from '@/actions/tracking';
import type { ShippingTrackingOutput } from '@/ai/flows/shipping-tracking-flow';

/**
 * Props for the ShippingTracker component.
 * @param initialTrackingNumber - The tracking number to pre-fill the input with.
 * @param dictionary - The language dictionary for localization.
 */
interface ShippingTrackerProps {
  initialTrackingNumber: string;
  dictionary: any;
}

/**
 * A client-side component to track Shipping shipments.
 * It provides an input for the tracking number and displays the shipment's
 * current status and history of events upon submission.
 */
export function ShippingTracker({ initialTrackingNumber, dictionary }: ShippingTrackerProps) {
  // --- State Management ---
  // State for the tracking number input field.
  const [trackingNumber, setTrackingNumber] = useState(initialTrackingNumber);
  // State to manage the loading status during the API call.
  const [isLoading, setIsLoading] = useState(false);
  // State to store the tracking information received from the API.
  const [trackingInfo, setTrackingInfo] = useState<ShippingTrackingOutput | null>(null);
  // State to hold any errors that occur during the API call.
  const [error, setError] = useState<string | null>(null);

  /**
   * Handles the form submission to track an order.
   * It calls the `trackOrder` server action and updates the component's state
   * with the result or an error message.
   * @param e - The form event.
   */
  const handleTrackOrder = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission behavior.
    setIsLoading(true);
    setTrackingInfo(null);
    setError(null);

    try {
      // Call the server action to get tracking info.
      const result = await trackOrder(trackingNumber);
      if (result) {
        setTrackingInfo(result);
      } else {
        setError(dictionary.tracking_not_found);
      }
    } catch (e) {
      console.error("ShippingTracker Error:", e);
      setError(dictionary.tracking_error);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Render Logic ---
  return (
    <div className="space-y-4">
      {/* Header section with tracking title and initial number */}
      <div className="flex items-center gap-3">
        <Truck className="h-6 w-6 text-primary" suppressHydrationWarning />
        <div>
          <h3 className="font-semibold">{dictionary.order_confirmation_tracking_title}</h3>
          <p className="text-sm text-muted-foreground">
            {dictionary.order_confirmation_tracking_number}: <span className="font-mono">{initialTrackingNumber}</span>
          </p>
        </div>
      </div>
      
      {/* Tracking form */}
      <form onSubmit={handleTrackOrder} className="flex items-center gap-2">
        <Input
          type="text"
          value={trackingNumber}
          onChange={e => setTrackingNumber(e.target.value)}
          placeholder={dictionary.order_confirmation_tracking_placeholder}
          className="flex-grow"
          disabled={isLoading}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? '...' : dictionary.order_confirmation_track_button}
        </Button>
      </form>
      
      {/* Conditional rendering based on state */}
      {isLoading && <Skeleton className="h-24 w-full" />}

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {trackingInfo && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {dictionary.tracking_status}: {trackingInfo.currentStatus}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{dictionary.tracking_event_status}</TableHead>
                  <TableHead>{dictionary.tracking_event_location}</TableHead>
                  <TableHead className="text-right">{dictionary.tracking_event_date}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trackingInfo.events.map((event, index) => (
                  <TableRow key={index}>
                    <TableCell>{event.status}</TableCell>
                    <TableCell>{event.location}</TableCell>
                    <TableCell className="text-right">{event.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
