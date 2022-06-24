import { addDoc, arrayUnion, collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore'
import { useEffect } from 'react'
import { db } from '../firebase-config'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

const AddWorkSpace = ({ closeModal }) => {
  const workspaceRef = collection(db, 'workspace')

  const auth = getAuth();
  let userID = "";
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const uid = user.uid
      userID = uid
    }
  })

  useEffect(() => {
    const addForm = document.querySelector('.addWorkspace')
    addForm.addEventListener('submit', (e) => {
      e.preventDefault()
      const doc = addDoc(workspaceRef, {
        name: addForm.workspaceName.value,
        description: addForm.workspaceDescription.value,
        memberId: [],
        adminId: [userID],
        visibility: addForm.visibility.value
      })

      closeModal(false)
    })


  })
  
  return (
    <div tabIndex="-1" aria-hidden="true" className="fixed overflow-y-auto overflow-x-hidden w-full md:inset-0 md:h-full bg-gray-500 bg-opacity-30 h-full flex justify-center items-center">
      <div className="fixed p-4 w-full max-w-2xl h-full md:h-auto">
        <div className="bg-white rounded-lg shadow dark:bg-gray-700 border-2 relative">
          <button onClick={() => closeModal(false)} type="button" className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white" data-modal-toggle="authentication-modal">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
          </button>
          <div className="py-6 px-6 lg:px-8">
            <h3 className="mb-4 text-xl font-medium text-gray-900 dark:text-white">Create Workspace</h3>
            <form className="addWorkspace space-y-6">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Workspace Name</label>
                <input autoComplete="off" spellCheck="false" type="text" className="border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-600 dark:text-white focus:outline-none" placeholder="Workspace Name" name="workspaceName" required></input>
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Workspace Description</label>
                <textarea autoComplete="off" spellCheck="false" type="text" placeholder="Workspace Description" className="border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:border-gray-500 dark:text-white min-h-[200px] max-h-[200px] focus:outline-none" name="workspaceDescription" required></textarea>
              </div>
              <div>
                <label htmlFor="visibility" className="block mb-2 text-sm font-medium text-gray-900">
                  Visibility
                </label>
                <select
                  id="visibility"
                  name="visibility"
                  className="mt-1 block w-full pl-2 pr-10 py-2 text-base border-2 border-gray-300 focus:outline-none sm:text-sm rounded-md"
                  defaultValue="Public"
                >
                  <option>Public</option>
                  <option>Private</option>
                </select>
              </div>
              <button className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-3 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Create Workspace</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddWorkSpace
