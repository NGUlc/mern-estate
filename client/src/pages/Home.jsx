import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {Swiper, SwiperSlide} from 'swiper/react';
import 'swiper/css/bundle';
import SwiperCore from 'swiper';
import { Navigation } from 'swiper/modules';
import ListingItem from "../components/ListingItem";
export default function Home() {
  const[offerListings, setOfferListings] = useState([]);
  const[saleListings, setSaleListings] = useState([]);
  const[rentListings, setRentListings] = useState([]);
  SwiperCore.use([Navigation]);
  console.log(saleListings);
  useEffect(() => {
    const fetchOfferListings = async () => {
    try {
      const res = await fetch('/api/listing/get?offer=true&limit=4') ;
      const data = await res.json();
      setOfferListings(data);
      fetchRentListings()
    } catch (error) { 
        console.log(error);
      }
    }
    const fetchRentListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=rent&limit=4') ;
        const data = await res.json();
        setRentListings(data);
        fetchSaleListings();
      } catch (error) { 
        console.log(error);
      }
    }

    const fetchSaleListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=sale&limit=4') ;
        const data = await res.json();
        setSaleListings (data);
      } catch (error) { 
        console.log(error);
      }
    }
    fetchOfferListings();
}, [])
  return (
    <div>
      <div className='flex flex-col gap-6 px-3 mx-auto max-w-8xl p-28'>
        <h1  className="text-3xl font-bold text-slate-700 lg:text-6xl">
          Find your next <span className="text-slate-500">perfect</span>
          <br/>
          place with ease
        </h1>
        <div className='text-xs text-gray-400 sm:text-sm'>
          Sahand estate is the best place to find your nexr perfect place to live.
          <br/>
          We have a wide range of properties for you to choose from.
        </div>
        <Link to={"/search"} className="text-xs font-bold text-blue-800 hover:underline sm:text-sm">Let's get started...</Link>
      </div>
      <Swiper navigation>
        {
          offerListings && offerListings.length > 0 && 
          offerListings.map((listing) => (
            <SwiperSlide>
              <div style={{background:`url(${listing.imageUrls[0]}) center no-repeat`, backgroundSize:"cover" }} 
              className="h-[500px]" key={listing._id}></div>
            </SwiperSlide>
          ))
        }
      </Swiper>
      <div className="flex flex-col gap-8 p-3 mx-auto my-10 max-w-8xl">
        {offerListings && offerListings.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-600">Recent offers</h2>
              <Link className="text-sm text-blue-800" to={'/search?offer=true'}>
                Show more offers
              </Link>
            </div>
            <div className="flex flex-wrap gap-6">
              {
                offerListings.map((listing) => (
                  <ListingItem listing={listing} key={listing._id} />
                ))
              }
            </div>
          </div>
        )}
        {rentListings && rentListings.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-600">Recent places for rent</h2>
              <Link className="text-sm text-blue-800" to={'/search?type=rent'}>
                Show more places for rent
              </Link>
            </div>
            <div className="flex flex-wrap gap-6">
              {
                rentListings.map((listing) => (
                  <ListingItem listing={listing} key={listing._id} />
                ))
              }
            </div>
          </div>
        )}
        {saleListings && saleListings.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-600">Recent places for sale</h2>
              <Link className="text-sm text-blue-800" to={'/search?type=sale'}>
                Show more places for sale
              </Link>
            </div>
            <div className="flex flex-wrap gap-6">
              {
                saleListings.map((listing) => (
                  <ListingItem listing={listing} key={listing._id} />
                ))
              }
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
