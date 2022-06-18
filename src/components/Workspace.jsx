import userEvent from '@testing-library/user-event'
import { collection, getDocs, onSnapshot } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { db } from '../firebase-config'

const Workspace = () => {

  const workspaceRef = collection(db, 'workspace')

  const [workspaceList, setWorkspaceList] = useState([])
  
  useEffect(() => {
    // const getWorkspace = async () => {
    //   const data = await getDocs(workspaceRef)
    //   setWorkspaceList(data.docs.map((doc) => ({...doc.data(), id: doc.id})))
    // }

    onSnapshot(workspaceRef ,(snapshot) => {
      if(!snapshot.empty) {
        setWorkspaceList(snapshot.docs.map((doc) => doc.data()))
      }
    })
   
    
  }, [])
  
  
  
  return (
    <div className="workspace">
        {workspaceList.map((workspace) => {
            return (
              <div className="p-2.5 mt-4 flex items-center rounded-md cursor-pointer hover:underline">
                <span className="text-[15px] ml-4">{workspace.name}</span>
              </div>
            )
        })}
    </div>
  )
}

export default Workspace