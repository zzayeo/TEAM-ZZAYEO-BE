const Place = require('../models/place');
const Day = require('../models/day');
const Plan = require('../models/reply');
const deleteS3 = require('../middlewares/deleteS3');

//대상 장소 찾기
const getTargetPlace = async ({ PlaceId }) => {
    const targetPlaces = await Place.findOne({ _id: PlaceId });
    return targetPlaces;
};

//여행 일정 생성
const createplaces = async ({ dayId, placeName, lat, lng, address, time, memoText }) => {
    const findDay = await Day.findOne({ _id: dayId });
    const findPlan = await Plan.findOne({ _id: findDay.planId });

    if (findPlan.destination === '국내') {
        const splited = address.split(' ');
        findPlan.locations.push(splited[1]);
        findPlan.locations.push(splited[2]);
    }
    if (findPlan.destination === '해외') {
        const country = address.match(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]+/)[0]; //배열에서 한글(정규표현식) 찾아서 변수에 담기
        findPlan.locations.push(country);
    }

    findPlan.locations = [...new Set(findPlan.locations)]; // Set 자료형 사용하여 배열 내 중복값 제거 후 ...(Spread 연산자)로 List 로 변경

    await findPlan.save();

    const newPlace = new Place({
        planId: findDay.planId,
        dayId,
        placeName,
        time,
        lat,
        lng,
        address,
        memoText,
    });

    // for(let i=0; i< videoUrl.length; i++) {
    //     newPlace.memoImage.push(videoUrl[i].location)
    // }
    for (let i = 0; i < imageUrl.length; i++) {
        newPlace.memoImage.push(imageUrl[i].location);
    }
    if (memoText) newPlace.memoText = memoText;

    await newPlace.save();

    // const newDayFind = await Day.findOne({_id: dayId}).populate('places')
    // console.log("newDayFind :",newDayFind)

    return;
};

//여행 일정 수정
const updateplaces = async ({ placeId, placeName, lat, lng, address, time, memoText }) => {
    const findPlace = await Place.findOneAndUpdate(
        { _id: placeId },
        { placeName, lat, lng, address, time, memoText }
    );

    // for(let i=0; i< videoUrl.length; i++) {
    //     findPlace.memoImage.push(videoUrl[i].location)
    // }

    for (let i = 0; i < imageUrl.length; i++) {
        findPlace.memoImage.push(imageUrl[i].location);
    }

    if (memoText) updateplaces.memoText = memoText;

    await findPlace.save();
    return;
};

//여행 일정 이미지 삭제
const deleteMemoImageInPlace = async ({ placeId, imageIndex }) => {
    const findPlace = await Place.findOne({ _id: placeId });
    const deleteImage = findPlace.memoImage.splice(imageIndex, 1);
    deleteS3(deleteImage);
    await findPlace.save();
};

//여행 일정 삭제
const placesdelete = async ({ placeId }) => {
    await Place.deleteOne({ _id: placeId });

    return;
};

module.exports = {
    createplaces,
    updateplaces,
    placesdelete,
    getTargetPlace,
    deleteMemoImageInPlace,
};
