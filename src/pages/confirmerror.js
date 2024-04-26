 

 const  Confirmerror = () => {

    return (
        <div className="text-center">
            <h1 className="text-2xl font-bold">Page access denied/Invalid</h1>
            <p className="text-red-500">Sorry, you don't have permission to access this page.</p>
            <p>
                Please click <a href="/home" className="text-blue-500">here</a> to go back to the home page.
            </p>
        </div>
    )
}

export default Confirmerror;