'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface RideRequestFormProps {
  onSubmit: (data: any) => void
}

export function RideRequestForm({ onSubmit }: RideRequestFormProps) {
  const [formData, setFormData] = useState({
    departure: '',
    destination: '',
    departureTime: '',
    passengers: '1',
    maxPrice: '',
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
      passengers: '1',
      maxPrice: '',
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
          <label className="text-sm font-medium text-foreground block mb-2">
            Passengers
          </label>
          <Input
            type="number"
            name="passengers"
            min="1"
            max="5"
            value={formData.passengers}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground block mb-2">
            Max Price Per Seat
          </label>
          <Input
            type="number"
            name="maxPrice"
            placeholder="$0.00"
            step="0.01"
            value={formData.maxPrice}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-foreground block mb-2">
          Preferences
        </label>
        <textarea
          name="notes"
          placeholder="Any preferences (e.g., non-smoker, quiet ride, music okay)..."
          value={formData.notes}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          rows={3}
        />
      </div>

      <Button type="submit" className="w-full bg-accent hover:bg-accent/90">
        Find a Ride
      </Button>
    </form>
  )
}
