import { getAuth } from 'firebase/auth'
import React from 'react'
import AdminCardBoard from './AdminCardBoard'
import MemberCardBoard from './MemberCardBoard'

const BoardMember = ({ closeSettings, role, admin, member }) => {
  return (
    <div tabIndex="-1" aria-hidden="true" className="fixed overflow-y-auto overflow-x-hidden w-full md:inset-0 md:h-full bg-gray-500 bg-opacity-30 h-full flex justify-center items-center">
      <div className="fixed p-4 w-full max-w-2xl h-full md:h-auto">
        <div className="bg-white rounded-lg shadow dark:bg-gray-700 border-2 relative">
          <button onClick={() => closeSettings(false)} type="button" className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white" data-modal-toggle="authentication-modal">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
          </button>
          <div className="pb-6 px-6 lg:px-8">
            {/* <h3 className="mb-4 text-xl font-medium text-gray-900 dark:text-white"></h3> */}
            <div className="updateBoard space-y-6">
              {member.length !== 0 ? <div className="pt-4">
                <p className="font-bold text-xl pr-2 mb-5">{"Member List (" + member.length + ")"}</p>
                <div className="flex flex-wrap gap-8">
                  {member.map((user) => {

                    return (
                      <MemberCardBoard key={user.userId} user={user} role={role} />
                    )

                  })
                  }
                </div>
              </div> : <div className="mt-[-24px]"></div>}



              {admin.length !== 0 ? <div className="pt-2">

                <p className="font-bold text-xl pr-2 mb-5">{"Admin List (" + admin.length + ")"}</p>
                <div className="flex flex-wrap gap-8">
                  {admin.map((user) => {

                    const auth = getAuth()
                    var bool = false
                    if (user.userId === auth.currentUser.uid) {
                      bool = true;
                    }

                    return (
                      <AdminCardBoard user={user} role={role} bool={bool}/>
                    )
                  })}
                </div>
              </div> : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BoardMember