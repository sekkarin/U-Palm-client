import React from 'react'

export default function ItemVarian({ params }: { params: { id: string } }) {
  return (
    <div>Item varian {params.id}</div>
  )
}