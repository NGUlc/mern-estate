import { Link } from "react-router-dom";
import { MdLocationOn } from 'react-icons/md';

export default function ListingItem({listing}) {
  return (
    <div className='overflow-hidden transition-shadow bg-white rounded-lg 
    shadow-md w-full sm:w-[330px] hover:shadow-lg'>
        <Link to={`/listing/${listing._id}`}>
            <img src={listing.imageUrls[0] || "data:image/jpeg;base64,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"} alt='listing cover'
             className='h-[320px] sm:h-[220px] w-full object-cover 
             hover:scale-105 transition-scale duration-300' />
            <div className='flex flex-col w-full gap-2 p-3'>
                <p className="text-lg font-semibold truncate text-slate-700">{listing.name}</p>
                <div className="flex items-center gap-1">
                    <MdLocationOn className='w-4 h-4 text-green-700'/>
                    <p className='w-full text-sm text-gray-600 truncate'>
                    {listing. address}</p>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">{listing.description}</p>
                <p className="mt-2 font-semibold text-slate-500">
                  ${listing.offer ? listing.discountPrice.toLocaleString('en-US') : listing.regularPrice.toLocaleString('en-US')}
                  {listing.type === 'rent' && ' / month'}
                </p>
                <div className="flex gap-4 text-slate-700">
                  <div className="text-xs font-bold">
                    {listing.bedrooms > 1 ? `${listing.bedrooms} beds `:
                    `${listing.bedrooms} bed `}
                  </div>
                  <div className="text-xs font-bold">
                    {listing.bathrooms > 1 ? `${listing.bathrooms} baths `:
                    `${listing.bathrooms} bath `}
                  </div>
                </div>
            </div>
        </Link>
    </div>
  )
}
