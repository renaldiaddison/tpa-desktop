import { addDoc, collection } from 'firebase/firestore'
import React, { useEffect } from 'react'
import { db } from '../firebase-config'

const CardModal = ({ closeModal, listId, index}) => {

    const cardRef = collection(db, "card")

    useEffect(() => {
        const addForm = document.querySelector('.addCard')
        addForm.addEventListener('submit', (e) => {
            e.preventDefault()
            addDoc(cardRef, {
                title: e.target.cardTitle.value,
                description: "",
                labels: [],
                listId: listId,
                index: index,
                duedate: []
            })
            closeModal(false)
        })
    }, [])


    return (
        <div tabIndex="-1" aria-hidden="true" className="fixed overflow-y-auto overflow-x-hidden w-full md:inset-0 md:h-full bg-gray-500 bg-opacity-30 h-full flex justify-center items-center">
            <div className="fixed p-4 w-full max-w-2xl h-full md:h-auto">
                <div className="bg-white rounded-lg shadow dark:bg-gray-700 border-2 relative">
                    <button onClick={() => closeModal(false)} type="button" className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white" data-modal-toggle="authentication-modal">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                    </button>
                    <div className="py-6 px-6 lg:px-8">
                        <h3 className="mb-4 text-xl font-medium text-gray-900 dark:text-white">Create Card</h3>
                        <form className="addCard space-y-6" autoComplete="off">
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Card Title</label>
                                <input spellCheck="false" type="text" className="border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-600 dark:text-white" placeholder="Card Title" name="cardTitle" required></input>
                            </div>
                            <button className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-3 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Create Card</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CardModal