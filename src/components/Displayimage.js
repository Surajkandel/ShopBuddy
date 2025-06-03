import React from 'react';
import { IoClose } from 'react-icons/io5';

const DisplayImage = ({
  imgUrl,
  onClose
}) => {
  return (
    <div className='fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4'>
      <div className='relative max-w-full max-h-full'>
        <button
          className='absolute -top-10 right-0 text-2xl text-white hover:text-blue-400 transition-colors z-10'
          onClick={onClose}
        >
          <IoClose />
        </button>
        <img 
          src={imgUrl} 
          alt='displayed content' 
          className='max-h-[70vh] max-w-[70vw] object-contain' 
        />
      </div>
    </div>
  );
};

export default DisplayImage;