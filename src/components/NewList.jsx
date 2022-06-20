import { doc, updateDoc } from 'firebase/firestore'
import React, { useRef, useState } from 'react'
import { useEffect } from 'react'
import { db } from '../firebase-config'

const NewList = ({ listId, listTitle, listDesc }) => {
	
	const [showButton, setShowButton] = useState(false)
	
	const [title, setTitle] = useState("")
	const [desc, setDesc] = useState("")
	const ref = useRef()
	const descRef = useRef()

	const valueChanges = () => {
		const inputTitle = document.getElementById("title" + listId).value
		const textTitle = document.getElementById("title" + listId).defaultValue
		
		const inputDesc = document.getElementById("desc" + listId).value
		const textDesc = document.getElementById("desc" + listId).defaultValue
		if ((textTitle === inputTitle) && (inputDesc === textDesc)) {
			setShowButton(false)
		}
		else {
			setTitle(inputTitle)
			setDesc(inputDesc)
			setShowButton(true)
		}
	}
	
	const updateList = async () => {
		const boardDoc = doc(db, "list", listId)
		const newField = { title: title, description: desc }
		await updateDoc(boardDoc, newField)
		ref.current.blur()
		descRef.current.blur()
		setShowButton(false)
	}
	
	const enterPress = (e) => {
		if (e.keyCode === 13) {
			updateList(listId)
		}
	}
	
	
	return (
		<div className="px-6 py-4">
		<input type="text" id={"title" + listId} name="title" className="font-bold text-xl mb-2 w-full px-1 focus:outline-none truncate" defaultValue={listTitle} onChange={valueChanges} onKeyDown={enterPress} ref={ref}></input>
		<input type="text" id={"desc" + listId} name="description" className="text-gray-700 text-base px-1 mb-2 focus:outline-none truncate" defaultValue={listDesc} onChange={valueChanges} onKeyDown={enterPress} ref={descRef}></input>
		{showButton && <p onClick={() => { updateList(listId) }} className="inline-flex items-center px-3 py-1 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-700 focus:outline-none cursor-pointer">
		Save
		</p>}
		</div>
		)
	}
	
	export default NewList