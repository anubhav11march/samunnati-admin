import React, { useEffect, useRef, useState } from 'react';
import '../../styles/newstyles/addPropertyForm.css';
import { useParams, useHistory } from 'react-router-dom';
import { getPropertyById, updateProperty } from '../../redux/api';
import { storage } from '../../firebase';
import LoadingPage from '../utils/LoadingPage';
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
const EditPropertyForm = () => {
  const history = useHistory();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const isFirstRender = useRef(true);
  const [spinn, setspinn] = useState(false);
  const [propertyData, setpropertyData] = useState({
    name: '',
    location: '',
    lat: '',
    lng: '',
    city: '',
    area: '',
    BHK: '',
    price: '',
    ready: '',
    unitsLeft: '',
    amenities: '',
    pictures: [],
    description: '',
  });

  const [error, setError] = useState({
    name: false,
    location: false,
    lat: false,
    lng: false,
    city: false,
    area: false,
    BHK: false,
    price: false,
    ready: false,
    unitsLeft: false,
    amenities: false,
    pictures: false,
    description: false,
  });
  const getPropertyData = async () => {
    setLoading(true);
    try {
      const res = await getPropertyById(id);
      const pdata = res.data.data;
      setpropertyData({
        ...pdata,
        ready: pdata.ready === true ? 'YES' : 'NO',
        amenities: pdata.amenities.join(''),
        area: pdata.area.slice(0, -4),
      });
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  useEffect(() => {
    getPropertyData(id);
  }, []);

  const handleImageDelete = (event, imgurl) => {
    setpropertyData({
      ...propertyData,
      pictures: propertyData.pictures.filter((img) => {
        return img !== imgurl;
      }),
    });
  };
  const handleInputchange = (name) => (event) => {
    setpropertyData({ ...propertyData, [name]: event.target.value });
  };

  async function uploadImageAsPromise(file) {
    const storageRef = ref(storage, `PropertyPictures/${file.name}`);
    return new Promise(function (resolve, reject) {
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        'state_changed',
        (snapshot) => {},
        function error(err) {
          reject(err);
        },
        async function complete() {
          getDownloadURL(uploadTask.snapshot.ref).then((url) => {
            resolve(url);
          });
        }
      );
    });
  }
  const handleFileInputchange = async (e) => {
    e.preventDefault();
    const promises = [];
    for (const file of e.target.files) {
      promises.push(uploadImageAsPromise(file));
    }
    const data = await Promise.all(promises);
    setpropertyData({
      ...propertyData,
      pictures: [...propertyData.pictures, ...data],
    });
  };

  const handlerValidatedFormSubmit = async () => {
    try {
      await updateProperty({
        id: id,
        ...propertyData,
        ready: propertyData.ready === 'YES' ? true : false,
        amenities: propertyData.amenities.split(' ').filter((t) => t.length),
        area: propertyData.area + 'sqft',
      });
      // history.push('/property');
      setspinn(false);
    } catch (error) {
      console.log(error);
      setspinn(false);
    }
  };
  const handlesubmit = (e) => {
    e.preventDefault();
    const updatedError = {
      name: propertyData.name == '' ? true : false,
      location: propertyData.location == '' ? true : false,
      lat: propertyData.lat == '' ? true : false,
      lng: propertyData.lng == '' ? true : false,
      city: propertyData.city == '' ? true : false,
      area: propertyData.area == '' ? true : false,
      BHK: propertyData.BHK == '' ? true : false,
      price: propertyData.price == '' ? true : false,
      ready: propertyData.ready == '' ? true : false,
      unitsLeft: propertyData.unitsLeft == '' ? true : false,
      amenities: propertyData.amenities == '' ? true : false,
      pictures: !propertyData.pictures.length ? true : false,
      description: propertyData.description == '' ? true : false,
    };
    console.log(updatedError);
    setError(updatedError);
  };
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    } else {
      if (
        !error.name &&
        !error.location &&
        !error.lat &&
        !error.log &&
        !error.city &&
        !error.area &&
        !error.BHK &&
        !error.price &&
        !error.ready &&
        !error.unitsLeft &&
        !error.amenities &&
        !error.description &&
        !error.pictures
      ) {
        setspinn(true);
        handlerValidatedFormSubmit();
      }
    }
  }, [error]);

  return (
    <form>
      <div className="addproperty-container">
        {loading ? (
          <LoadingPage />
        ) : (
          <div className="addproperty-personalDetails">
            {/* 1st row */}
            <div className="addproperty-alignRow">
              {/* Property Name */}
              <div className="addproperty-inputFieldDiv form-group">
                <label className="addproperty-inputLabel ">
                  Property Name{' '}
                  <span style={{ color: 'red', fontSize: '1.2rem' }}>*</span>{' '}
                </label>
                <input
                  type="text"
                  name="Property Name"
                  placeholder="Property Name"
                  className="addproperty-inputField"
                  id={error.name ? 'red-border' : ''}
                  onChange={handleInputchange('name')}
                  value={propertyData.name}
                />
              </div>
              {/* Location */}
              <div className="addproperty-inputFieldDiv form-group">
                <label className="addproperty-inputLabel">
                  Property Location{' '}
                  <span style={{ color: 'red', fontSize: '1.2rem' }}>*</span>{' '}
                </label>
                <input
                  type="text"
                  id={error.location ? 'red-border' : ''}
                  name="Property Location"
                  placeholder="Property Location"
                  className="addproperty-inputField"
                  onChange={handleInputchange('location')}
                  value={propertyData.location}
                />
              </div>
            </div>

            {/* 2nd row */}
            <div className="addproperty-alignRow">
              {/* Location Latitude */}
              <div className="addproperty-inputFieldDiv form-group">
                <label className="addproperty-inputLabel">
                  Location Latitude{' '}
                  <span style={{ color: 'red', fontSize: '1.2rem' }}>*</span>{' '}
                </label>
                <input
                  type="text"
                  name="Location Latitude"
                  id={error.lat ? 'red-border' : ''}
                  placeholder="Location Latitude"
                  className="addproperty-inputField"
                  onChange={handleInputchange('lat')}
                  value={propertyData.lat}
                />
              </div>
              {/* Location Longitude */}
              <div className="addproperty-inputFieldDiv">
                <label className="addproperty-inputLabel">
                  Location Longitude{' '}
                  <span style={{ color: 'red', fontSize: '1.2rem' }}>*</span>{' '}
                </label>
                <input
                  name="Location Longitude"
                  id={error.lng ? 'red-border' : ''}
                  onChange={handleInputchange('lng')}
                  placeholder="Location Longitude"
                  className="addproperty-inputField"
                  type="text"
                  value={propertyData.lng}
                />
              </div>
            </div>
            {/* 3rd row */}
            <div className="addproperty-alignRow">
              {/* City */}
              <div className="addproperty-inputFieldDiv">
                <label className="addproperty-inputLabel">
                  City{' '}
                  <span style={{ color: 'red', fontSize: '1.2rem' }}>*</span>{' '}
                </label>
                <input
                  type="text"
                  name="City"
                  placeholder="City"
                  className="addproperty-inputField"
                  onChange={handleInputchange('city')}
                  id={error.city ? 'red-border' : ''}
                  value={propertyData.city}
                />
              </div>
              {/* Area */}
              <div className="addproperty-inputFieldDiv">
                <label className="addproperty-inputLabel">
                  Area{' '}
                  <span style={{ color: 'red', fontSize: '1.2rem' }}>*</span>{' '}
                </label>
                <input
                  type="text"
                  name="Area"
                  placeholder="Area"
                  className="addproperty-inputField"
                  onChange={handleInputchange('area')}
                  id={error.area ? 'red-border' : ''}
                  value={propertyData.area}
                />
              </div>
            </div>

            {/* 4th row */}
            <div className="addproperty-alignRow">
              {/* BHK */}
              <div className="addproperty-inputFieldDiv">
                <label className="addproperty-inputLabel">
                  BHK{' '}
                  <span style={{ color: 'red', fontSize: '1.2rem' }}>*</span>{' '}
                </label>
                <input
                  type="number"
                  name="BHK"
                  placeholder="BHK"
                  className="addproperty-inputField"
                  onChange={handleInputchange('BHK')}
                  id={error.BHK ? 'red-border' : ''}
                  value={propertyData.BHK}
                />
              </div>
              {/* Price */}
              <div className="addproperty-inputFieldDiv">
                <label className="addproperty-inputLabel">
                  Price{' '}
                  <span style={{ color: 'red', fontSize: '1.2rem' }}>*</span>{' '}
                </label>
                <input
                  type="text"
                  name="Price"
                  placeholder="(xx L-yy L)"
                  className="addproperty-inputField"
                  onChange={handleInputchange('price')}
                  id={error.price ? 'red-border' : ''}
                  value={propertyData.price}
                />
              </div>
            </div>
            {/* 5th row */}
            <div className="addproperty-alignRow">
              {/* Property Ready To Move In*/}
              <div className="addproperty-inputFieldDiv">
                <label className="addproperty-inputLabel">
                  Ready To Move In{' '}
                  <span style={{ color: 'red', fontSize: '1.2rem' }}>*</span>{' '}
                </label>
                <div onChange={handleInputchange('ready')}>
                  <input
                    type="radio"
                    value="YES"
                    name="city"
                    checked={propertyData.ready === 'YES'}
                  />{' '}
                  YES &nbsp;&nbsp;&nbsp;&nbsp;
                  <input
                    type="radio"
                    value="NO"
                    name="city"
                    checked={propertyData.ready === 'NO'}
                  />{' '}
                  NO
                </div>
              </div>
              {/* Units Left */}
              <div className="addproperty-inputFieldDiv">
                <label className="addproperty-inputLabel">
                  Units Left{' '}
                  <span style={{ color: 'red', fontSize: '1.2rem' }}>*</span>{' '}
                </label>
                <input
                  type="number"
                  name="Units Left"
                  placeholder="Units Left"
                  className="addproperty-inputField"
                  onChange={handleInputchange('unitsLeft')}
                  id={error.area ? 'red-border' : ''}
                  value={propertyData.unitsLeft}
                />
              </div>
            </div>

            {/* 6th row */}
            <div className="addproperty-alignRow">
              {/* Amenities */}
              <div className="addproperty-textFieldDiv">
                <label className="addproperty-inputLabel">
                  Amenities{' '}
                  <span style={{ color: 'red', fontSize: '1.2rem' }}>*</span>{' '}
                </label>
                <input
                  className="addproperty-inputField"
                  onChange={handleInputchange('amenities')}
                  type="text"
                  name="amenities"
                  id={error.amenities ? 'red-border' : ''}
                  value={propertyData.amenities}
                />
              </div>
            </div>
            {/*7th row */}
            <div className="addproperty-alignRow">
              {/* Property  Pictures */}
              <div className="addproperty-textFieldDiv">
                <label className="addproperty-inputLabel">
                  Property Pictures{' '}
                  <span style={{ color: 'red', fontSize: '1.2rem' }}>*</span>{' '}
                </label>
                <input
                  type="file"
                  name="thumbnail"
                  placeholder="Thumbnail"
                  className="addproperty-inputField"
                  onChange={(e) => handleFileInputchange(e)}
                  id={error.pictures ? 'red-border' : ''}
                  multiple
                />
              </div>
            </div>
            {/* 8th row   :- Image Preview */}
            <div className="addproperty-alignRow">
              <div className="addproperty-textFieldDiv d-flex flex-wrap flex-row gap-5">
                {propertyData.pictures.map((imgurl, index) => {
                  return (
                    <div className="d-flex flex-column align-items-end">
                      <button
                        type="button"
                        class="btn-close"
                        onClick={(event) => handleImageDelete(event, imgurl)}
                      ></button>
                      <img
                        src={imgurl}
                        height="100px"
                        width="100px"
                        alt="Developer image"
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 9th row */}
            <div className="addproperty-alignRow">
              {/*Description*/}
              <div className="addproperty-textFieldDiv">
                <label className="addproperty-inputLabel">
                  Description{' '}
                  <span style={{ color: 'red', fontSize: '1.2rem' }}>*</span>{' '}
                </label>
                <textarea
                  className="addproperty-textField"
                  onChange={handleInputchange('description')}
                  name="Description"
                  placeholder="Property Description"
                  id={error.description ? 'red-border' : ''}
                  value={propertyData.description}
                ></textarea>
              </div>
            </div>

            <div className="addproperty-submitDetailDiv">
              <button
                className="addproperty-submitDetailBtn"
                onClick={handlesubmit}
              >
                Edit Property
                {spinn ? (
                  <div
                    class="spinner-border spinner-border-sm text-white mx-2"
                    role="status"
                  >
                    <span class="visually-hidden">Loading...</span>
                  </div>
                ) : (
                  ''
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </form>
  );
};

export default EditPropertyForm;
