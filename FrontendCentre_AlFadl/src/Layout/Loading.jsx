import React from 'react'

function Loading() {
    return (
        <div>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/50 ml-64 p-6">
                <div className="loader"></div>
            </div>
        </div>
    )
}

export default Loading