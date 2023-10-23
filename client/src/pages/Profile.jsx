import {useSelector} from 'react-redux';
import { useRef, useState, useEffect } from 'react';
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage';
import {app} from '../firebase';
import {updateUserStart, updateUserSuccess, updateUserFailure,
  deleteUserStart, deleteUserSuccess, deleteUserFailure,
  signOutUserStart, signOutUserSuccess, signOutUserFailure} from '../redux/user/userSlice.js';
import { useDispatch } from 'react-redux';
import {Link} from 'react-router-dom';

export default function Profile() {
  const fileRef = useRef(null);
  const {currentUser, loading, error} = useSelector ((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const dispatch = useDispatch();
  

//firebase storage
//allow read;
//allow write: if
//request.resource.size < 2 * 1024 * 1024 &&
//request.resource.contentType.matches('image/.*')

useEffect (() => {
  if(file) {
    handleFileUpload(file);
   }
}, [file]);
const handleFileUpload = (file) => {
  const storage = getStorage(app);
  const fileName = new Date().getTime() + file.name;
  const storageRef = ref(storage, fileName);
  const uploadTask = uploadBytesResumable(storageRef, file);

  uploadTask.on('state_changed',
    (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      setFilePerc(Math.round(progress));
    },
  (error) => {
    setFileUploadError(true);
  },
  () => {
    getDownloadURL(uploadTask.snapshot.ref).then
    ((downloadURL) => setFormData({...formData, avator: downloadURL}));
  });
};

const handleChange = (e) => {
  setFormData({...formData, [e.target.id]: e.target.value})
};

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser.
        _id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData), 
      });
      const data = await res.json();
      if(data.success === false){
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
  } catch (error) {
    dispatch(updateUserFailure(error.message));
  }
}

const handleDeleteUser = async () => {
  try {
    dispatch(deleteUserStart());
    const res = await fetch(`/api/user/delete/${currentUser.
      _id}`, {
      method: 'DELETE',
    });
    const data = await res.json();
    if(data.success === false){
      dispatch(deleteUserFailure(data.message));
      return;
    }
    dispatch(deleteUserSuccess(data));
} catch (error) {
  dispatch(deleteUserFailure(error.message));
}
}

const handleSignOut = async () => {
  try {
    dispatch(signOutUserStart())
    const res = await fetch('/api/auth/signout')
    const data = await res.json();
    if(data.success === false){
      dispatch(deleteUserFailure(data.message))
      return;
    }
    dispatch(deleteUserSuccess(data))
  } catch (error) {
    dispatch(deleteUserFailure(data.message))
  }
}

const handleShowListings = async () => {
  try {
    setShowListingsError(false);
    const res = await fetch(`/api/user/listings/${currentUser._id}`);
    const data = await res.json();
    if(data.success === false){
      setShowListingsError(true);
      return;
    }
    setUserListings(data);
  } catch (error) {
    setShowListingsError(true);
  }
}



  return (
    <div className='max-w-lg p-3 mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input onChange={(e) => setFile(e.target.files[0])}
         type="file" ref = {fileRef} hidden accept='image/*'/>
         <img onClick={() => fileRef.current.click()} src={ formData.avator || currentUser.avator} alt="profile"
          className='self-center object-cover w-24 h-24 mt-2 rounded-full cursor-pointer ' />
          <p className='self-center text-sm'>
            {fileUploadError ? (
              <span className='text-red-700 '>Error Image upload
              (image must be less than 2 mb)</span>
              ) : filePerc > 0 && filePerc < 100 ? (
              <span className=' text-slate-700'> {`Uploading $
              {filePerc} %` }</span>
              ) : filePerc === 100 ? (
              <span className='text-green-700 '>Image successfully uploaded!</span>
              ) : (
                ''
              )}
            </p> 
          <input type="text" placeholder='username' defaultValue={currentUser.username} 
          id='username' 
          className='p-3 border rounded-lg' onChange={handleChange}/> 
          <input type="email" placeholder='email' defaultValue={currentUser.email} id='email'
          className='p-3 border rounded-lg' onChange={handleChange}/>
          <input type="text" placeholder='password' id='password'
          className='p-3 border rounded-lg' onChange={handleChange}/>
          <button disabled={loading} className='p-3 text-white uppercase rounded-lg bg-slate-700 hover: opacity-95'>
            {loading ? 'Loading...' : 'Update'}</button>
            <Link className='p-3 text-center text-white uppercase bg-green-700 rounded-lg hover:opacity-95' to = {"/create-listing"}>
              Create Listing
            </Link>
      </form>
      <div className= 'flex justify-between mt-5'>
        <span onClick={handleDeleteUser} className='text-red-700 cursor-pointer '>Delete account</span> 
        <span onClick={handleSignOut} className='text-red-700 cursor-pointer'>Sign out</span>
        </div>
        <p className='mt-5 text-red-700'>{error ? error : ''}</p>
        <p className='mt-5 text-green-700'>{updateSuccess ? 'User is updated successfully' 
        : ''}</p>
        <button onClick={handleShowListings} className='w-full text-green-700'>
          Show Listings
        </button>
        <p className='mt-5 text-red-700'>{showListingsError ? 'Error showing listings' : ''}</p>
        {userListings && userListings. length > 0 && 
        <div className='flex flex-col gap-4'>
          <h1 className='text-2xl font-semibold text-center mt-7'>Your Listings</h1>
          {userListings. map((listing) => (
        <div key={listing._id} className='flex items-center justify-between gap-4 p-3 border rounded-lg'>
          <Link to={`/listing/${listing._id}`}>
          <img src={listing.imageUrls[0]} alt='listing
          cover' className='object-contain w-16 h-16'/>
          </Link>
          <Link className='flex-1 font-semibold truncate text-slate-700 hover:underline' to={`/listing/${listing._id}`}>
            <p>{listing.name}</p>
          </Link>
          <div className='flex flex-col items-center'>
            <button className='text-red-700 uppercase'>Delete</button>
            <button className='text-green-700 uppercase'>Edit</button>
          </div>
        </div>
          ))}
        </div>}
    </div>
  )
}