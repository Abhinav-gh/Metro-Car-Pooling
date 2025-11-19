'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface RideOfferFormProps {
  onSubmit: (data: any) => void
}

export function RideOfferForm({ onSubmit }: RideOfferFormProps) {
  const [formData, setFormData] = useState({
    departure: '',
    destination: '',
    departureTime: '',
    seats: '1',
    pricePerSeat: '',
    notes: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    setFormData({
      departure: '',
      destination: '',
      departureTime: '',
      seats: '1',
      pricePerSeat: '',
      notes: '',
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
            📍
            Departure
          </label>
          <Input
            type="text"
            name="departure"
            placeholder="Enter departure location"
            value={formData.departure}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
            📍
            Destination
          </label>
          <Input
            type="text"
            name="destination"
            placeholder="Enter destination"
            value={formData.destination}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
            🕐
            Departure Time
          </label>
          <Input
            type="datetime-local"
            name="departureTime"
            value={formData.departureTime}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
            👥
            Available Seats
          </label>
          <Input
            type="number"
            name="seats"
            min="1"
            max="8"
            value={formData.seats}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground block mb-2">
            Price per Seat
          </label>
          <Input
            type="number"
            name="pricePerSeat"
            placeholder="$0.00"
            step="0.01"
            value={formData.pricePerSeat}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-foreground block mb-2">
          Additional Notes
        </label>
        <textarea
          name="notes"
          placeholder="Any special requirements or info..."
          value={formData.notes}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          rows={3}
        />
      </div>

      <Button type="submit" className="w-full">
        Post Ride Offer
      </Button>
    </form>
  )
}
