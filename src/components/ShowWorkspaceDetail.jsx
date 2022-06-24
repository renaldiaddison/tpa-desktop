import { doc, updateDoc } from 'firebase/firestore'
import React, { useEffect, useRef, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import Select from 'react-select'
import { db } from '../firebase-config'
import { getWorkspaceById } from '../Script/Workspace'

const ShowWorkspaceDetail = ({ closeSettings }) => {

    const options = [
        { value: 'Public', label: 'Public', },
        { value: 'Private', label: 'Private' }
    ];

    const refName = useRef()
    const refDesc = useRef()
    const location = useLocation()
    const p = useParams()

    const [ws, setWs] = useState([])
    const [vis, setVis] = useState([])


    useEffect(() => {
        getWorkspaceById(p.id).then((ws, id) => {
            setWs(ws)
            if (ws.visibility === 'Public') {
                setVis(options[0])
            }
            else {
                setVis(options[1])
            }
        });
        return () => { }

    }, [location])

    return (
        <div tabIndex="-1" aria-hidden="true" className="fixed overflow-y-auto overflow-x-hidden w-full md:inset-0 md:h-full bg-gray-500 bg-opacity-30 h-full flex justify-center items-center">
            <div className="fixed p-4 w-full max-w-2xl h-full md:h-auto">
                <div className="bg-white rounded-lg shadow dark:bg-gray-700 border-2 relative">
                    <button onClick={() => closeSettings(false)} type="button" className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white" data-modal-toggle="authentication-modal">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                    </button>
                    <div className="py-6 px-6 lg:px-8">
                        <h3 className="mb-4 text-xl font-medium text-gray-900 dark:text-white">Workspace Detail</h3>
                        <div className="updateWorkspace space-y-6">
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Workspace Name</label>
                                <p className="caret-transparent border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-600 dark:text-white focus:outline-none" name="workspaceName">{ws.name}</p>
                            </div>
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Workspace Description</label>
                                <textarea autoComplete="off" spellCheck="false" type="text" className="resize-none caret-transparent border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:border-gray-500 dark:text-white min-h-[200px] max-h-[200px] focus:outline-none cursor-default" name="workspaceDescription" ref={refDesc} defaultValue={ws.description} required></textarea>
                            </div>
                            <div>
                                <label htmlFor="visibility" className="block mb-2 text-sm font-medium text-gray-900">
                                    Visibility
                                </label>
                                <p className="caret-transparent border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-600 dark:text-white focus:outline-none" name="workspaceName">{vis.value}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ShowWorkspaceDetail