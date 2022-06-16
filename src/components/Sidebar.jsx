import React from 'react'

const Sidebar = () => {




  return (
    <div className="fixed ml-[-2px]">
      <div class="border-x-2 top-0 bottom-0 p-6 overflow-y-auto w-[270px] text-center bg-white h-screen">
        <div class="text-xl">
          <div class="flex items-center rounded-md ">
            <h1 class="text-[15px] ml-3 text-xl font-bold"></h1>
          </div>
          <div >
            <div class="border-2 px-2.5 py-2 mb-4 flex items-center rounded-md cursor-pointer bg-white">
              <svg className="h-5 w-5 text-slate-400"  width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">  <path stroke="none" d="M0 0h24v24H0z"/>  <circle cx="10" cy="10" r="7" />  <line x1="21" y1="21" x2="15" y2="15" /></svg>
              <input class="text-[15px] ml-2 w-full bg-transparent focus:outline-none" placeholder="Search" />
            </div>
            <div class=" p-2.5 mt-2 flex items-center rounded-md cursor-pointer hover:underline">
              <span class="text-[15px] ml-4">Boards</span>
            </div>
            <div class="p-2.5 mt-2 flex items-center rounded-md cursor-pointer hover:underline">
              <span class="text-[15px] ml-4">Lists</span>
            </div>
            <div class="p-2.5 my-2 flex items-center rounded-md cursor-pointer hover:underline">
              <span class="text-[15px] ml-4">Cards</span>
            </div>
            <div className="border-t border-slate-500"></div>
            <div class="p-2.5 mt-2 flex items-center rounded-none cursor-pointer">
              <span class="text-[15px] ml-4 mr-2">Add workspace</span>
              <svg className="cursor-pointer scale-75 h-8 w-8 text-black-500 opacity-50"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round">  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />  <line x1="12" y1="8" x2="12" y2="16" />  <line x1="8" y1="12" x2="16" y2="12" /></svg>
            </div>
            <div class="p-2.5 mt-2 flex items-center rounded-md cursor-pointer hover:underline text-red-600">
              <span class="text-[15px] ml-4">Logout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar