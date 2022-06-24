import { getAuth } from 'firebase/auth'
import { addDoc, arrayUnion, collection, doc, documentId, onSnapshot, query, updateDoc, where } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { useRef } from 'react'
import { useParams } from 'react-router-dom'
import Select from 'react-select'
import { db } from '../firebase-config'
import { toastError } from '../Script/Toast'


const InviteWorkspace = ({ closeSettings, admin, member, wsName, invited }) => {

  const [options, setOptions] = useState([])
  const p = useParams()

  const auth = getAuth()

  const [link, setLink] = useState("")
  const [selectedOptions, setSelectedOptions] = useState([])

  const selectRef = useRef()
  const opt = [
  ]

  const userRef = collection(db, "user")

  useEffect(() => {
    const q = query(userRef, where("userId", "!=", auth.currentUser.uid))
    onSnapshot(q, (snapshot) => {
      if (snapshot) {
        setOptions(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
      }
    })

  }, [])

  const insertOptions = () => {
    const wsPeop = [...admin, ...member]
    const wsPeople = [...wsPeop, ...invited]
    console.log(wsPeople)
    for (let i = 0; i < options.length; i++) {
      let valid = true;
      for (let j = 0; j < wsPeople.length; j++) {
        if (options[i].email === wsPeople[j].email) {
          valid = false
        }
      }
      if (valid === true && options[i].email !== "CHello@gmail.com") {
        opt.push({ value: options[i].userId, label: options[i].email })
      }

    }
  }

  const generateLink = () => {
    document.getElementById("link").style.display = "none"
    setLink('localhost:3000/invite-link/' + p.id)
  }

  const sendNotif = (id) => {
    const notifRef = collection(db, "notification")
    return addDoc(notifRef, {
      title: "",
      content: "You have been invited to join '" + wsName + "' workspace",
      senderId: "CHello.com",
      receiveId: id,
      type: "offer",
      wsId: p.id
    })
  }

  const updateInvitedWorkspace = async (id) => {
    const listDoc = doc(db, "workspace", p.id)
    await updateDoc(listDoc, {
      invitedId: arrayUnion(id)
    })
  }


  const handleClick = () => {
    const invited = selectRef.current.getValue()
    console.log(invited)


    for (let i = 0; i < invited.length; i++) {
      const userId = invited[i].value
      updateInvitedWorkspace(userId)
      sendNotif(userId)
    }
    closeSettings(false)
  }

  return (
    <div tabIndex="-1" aria-hidden="true" className="fixed overflow-y-auto overflow-x-hidden w-full md:inset-0 md:h-full bg-gray-500 bg-opacity-30 h-full flex justify-center items-center">
      {insertOptions()}
      <div className="fixed p-4 w-full max-w-2xl h-full md:h-auto">
        <div className="bg-white rounded-lg shadow dark:bg-gray-700 border-2 relative">
          <button onClick={() => closeSettings(false)} type="button" className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white" data-modal-toggle="authentication-modal">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
          </button>
          <div className="py-6 px-6 lg:px-8">
            <div className="addWorkspace space-y-3">
              <div>
                <label htmlFor="visibility" className="block text-sm mb-2 font-medium text-gray-900">
                  Choose user to invite
                </label>
                <Select
                  id="visibility"
                  name="visibility"
                  ref={selectRef}
                  options={opt}
                  isMulti="true"
                >
                </Select>
                <button onClick={() => handleClick()} className="w-full mt-4 px-4  text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm py-3 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Invite</button>
              </div>
              <p className="text-center">or</p>
              <button id="link" onClick={() => generateLink()} className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm py-3 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Generate Invite Link</button>
              <p className='text-red-500 text-center'>{link}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InviteWorkspace