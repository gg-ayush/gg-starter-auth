
import InventProdTable from '@/components/inventoryComponent/InventProdTable'
import React from 'react'

const Product = () => {
  return (
    <div className='bg-gray-100'>
  
    <header className="bg-gray-800 text-white p-4 shadow-md">
      <h2 className="text-3xl font-semibold text-center">Inventory Product</h2>
    </header>
    <main className='flex-1 p-2 mt-2'>
    <section className="grid grid-cols-4 gap-4 mb-4">
            <div className="bg-white p-4 rounded shadow">Total Products: 150</div>
            <div className="bg-white p-4 rounded shadow">Total quantity: 400</div>
            <div className="bg-white p-4 rounded shadow">Low Stock Alerts: 5</div>
            <div className="bg-white p-4 rounded shadow">Total Value: $10,000</div>
          </section>
    </main>
   
  
   
    <div>
      <InventProdTable/>
    </div>
    <footer className="bg-gray-800 text-white p-4 text-center">
        <p>© 2024 GG_POS | <a href="#" className="text-blue-400">Help/Support</a></p>
      </footer>
  </div>
  
  )
}

export default Product