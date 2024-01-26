import React, {useState} from "react";
import { AiOutlineMore} from "react-icons/ai";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";


const AdminOptions = ({id, handleRemoveCollection}) => {
    const [showOptions, setShowOptions] = useState(false)

  return (
        <div className="options-container">
            <div className="options-dots" onClick={() => setShowOptions((prev) => (!prev))}>
                <AiOutlineMore  />
            </div>
            <div className={`admin-options ${showOptions? 'show-admin-options' : 'hide-admin-options'}`}>
                <b>Edit</b>
                <b onClick={() => handleRemoveCollection(id)}>Remove</b>
            </div>
        </div>
  )
}

export default AdminOptions
