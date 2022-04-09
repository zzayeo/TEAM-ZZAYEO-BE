# Team-zzayeo-BE

# ✈️'짜여' 서비스 설명 보러가기

> [메인 ReadMe.md](https://github.com/zzayeo)를 참고 해주세요!

> '짜여' 사이트가 궁금하시다면 아래 바로가기를 참고 해주세요!
> 
<center>

[![바로가기 버튼](https://firebasestorage.googleapis.com/v0/b/megazine-11a01.appspot.com/o/images%2Fimg-bg%20(5).png?alt=media&token=647fca42-c2b2-479b-afe5-7b2af5ea32f7)](https://zzayeo.com/)

</center>

<br/>

![image](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/ae7c4c3e-cd78-44f9-bab6-20cdf8d69cc7/Group_366.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20220409%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20220409T052741Z&X-Amz-Expires=86400&X-Amz-Signature=414b544a35d678e723b9ed707240b0c41f92a7bf3205782387273c4ce9365a2a&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22Group%2520366.png%22&x-id=GetObject)

---

# 🙋 팀원 소개

|   이름   |                        깃허브 주소                         | 포지션 |
| :------: | :--------------------------------------------------------: | :----: |
|  이기곤  |   [https://github.com/LeeKiGont](https://github.com/LeeKiGon)   | 백엔드 |
|  서동현  |     [https://github.com/donghyeon23](https://github.com/donghyeon23)     | 백엔드 |
|  이재정  | [https://github.com/jaejeonglee](https://github.com/jaejeonglee) | 백엔드 |

<br>

---

# :hammer: 기술 스택

|  이름   |       설명       |
| :-----: | :--------------: |
| AWS EC2 |   서버 인스턴스   |
| Node.js |   JS 실행 환경    |
| Express | nodeJS Framework |
| mongoDB |   데이터 베이스   |
|   git   |    버전 관리      |
|  nginx  |  Reverse Proxy   |
<br>

---

# :book: 라이브러리

|       name        |            Appliance             | version  |
| :---------------: | :------------------------------: | :------: |
|     mongoose      |         데이터베이스 ORM         |  6.2.4  |
|       cors        |          cors 정책 설정          |  2.8.5   |
|      dotenv       |          환경변수 설정           |  16.0.0  |
|      multer       |        이미지 데이터 처리        |  1.4.4   |
|     multer-S3     |         사진 파일 업로드         |  2.10.0  |
|      aws-sdk      |             S3 접근              | 2.1085.0 |
|     socket.io     |        웹소켓 라이브러리         |  4.4.1   |
|   jsonwebtoken    | Json 포맷으로 사용자 속성을 저장 |  8.5.1   |
|      bcrypt       |         비밀번호 해쉬화          |  5.0.1   |
|     passport      |         소셜 로그인 구현         |  0.5.2   |
|      helmet       |         서버 보안성 향상         |  5.0.2   |
|      uniqid       |         고유값 생성            |  5.4.0   |
|     prettier      |         코드 스타일 통일         |  2.5.1   |

---

 # 📑 서비스 아키텍처
 
![짜여아키텍처](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/80585eb7-6129-426d-b207-282ee99fed53/Frame_2.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20220409%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20220409T050829Z&X-Amz-Expires=86400&X-Amz-Signature=10e476b6910703221bf34fa1d6c7cf6320a12e7eeb358cf190754fe2d42fbda7&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22Frame%25202.png%22&x-id=GetObject)
 
 ---
 
# 🔥 트러블슈팅
<details>
  <summary> <h3>웹 소켓,채팅</h3></summary>
<div markdown="1">
  
  ### 요구 사항
  
  채팅기능이 구현된 상태에서 유저가 웹에 들어와 있을 때 채팅방에 접속해있지 않아도 채팅이 왔는지 알 수 있어야 하고, 해당 유저의 게시글에 대한 타유저의 반응도 실시간으로 알려줄 수 있어야 한다고 생각.
![image](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/5a837a8b-79de-483c-b832-d1d6c982269e/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA_2022-04-02_03.21.32.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20220409%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20220409T051231Z&X-Amz-Expires=86400&X-Amz-Signature=3cd33a5931299866e4f3d96d226e1b0bf49ffded3a1fd7ecf48c9cee8ccf3b49&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22%25E1%2584%2589%25E1%2585%25B3%25E1%2584%258F%25E1%2585%25B3%25E1%2584%2585%25E1%2585%25B5%25E1%2586%25AB%25E1%2584%2589%25E1%2585%25A3%25E1%2586%25BA%25202022-04-02%252003.21.32.png%22&x-id=GetObject)
  
  ### 선택지
  
  1. 새로운 알림 및 메세지를 확인 할수 있는 API를 만들어 주기적으로 요청에 대한 응답을 보내준다.
  
  2. socket 이벤트가 발생할때마다 개별 유저에게 이벤트를 보내준다.
  
  ### 의사결정 및 근거
  
  - socket으로 이벤트 발생 시 알려준다.

    새로운 알림 및 메세지를 확인 할수 있는 API를 만들어 주기적으로 요청에 대한 응답을 보내준다면 실시간 처럼 보일 수는 있겠지만, 이벤트가 발생하지 않은 상황에서 요청을 하게된다면 클라이언트와 서버에서는 불필요한 비용을 사용하게 될 것이다. 그래서 socket을 이용하여 실시간 알림을 선택하게 되었다.
  ```javaScript
  // user A 와 B의 snsId 를 받아 고유 RoomName 생성시켜줌
const roomNameCreator = (snsIdA, snsIdB) => {
        const roomName = [snsIdA, snsId];
        arr.sort((a, b) => a - b);
        let createdRoomName= roomName[0] + roomName[1];
        return createdRoomName;
    };


// user 가 채팅을 보냈을때 DB에 저장후 해당 Room에 다시 뿌려준다.
socket.on('room', async ({ fromSnsId, toSnsId, chatText, createdAt }) => {
        ...
				const roomName = await roomNameCreator(fromSnsId, toSnsId)
        io.to(roomName).emit('chat', chatMessage);
				...
  ```
  ![image](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/fc87e835-4fd1-4411-a0ff-e73c2ec77738/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA_2022-04-02_03.21.39.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20220409%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20220409T051727Z&X-Amz-Expires=86400&X-Amz-Signature=d5d0c7a7c81a52d6f9961e6cb40adc55e5102ff96f51b5304bf4a39f7772e13c&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22%25E1%2584%2589%25E1%2585%25B3%25E1%2584%258F%25E1%2585%25B3%25E1%2584%2585%25E1%2585%25B5%25E1%2586%25AB%25E1%2584%2589%25E1%2585%25A3%25E1%2586%25BA%25202022-04-02%252003.21.39.png%22&x-id=GetObject)
  
추가적으로, 채팅방 접속 시 RoomName 을 생성해서 접속하는데, 유저가 해당 Room에 접속해있지 않은 경우 메세지를 실시간으로 받을수 없었다.
  
  ```javascript
  // 로그인 시 해당 유저 snsId 로 된 Room으로 보내줌
socket.on('login', async ({ fromSnsId }) => {
        socket.join(fromSnsId);
        const checkNew = await NoticeService.checkNewNotice({ snsId: fromSnsId})
        io.to(fromSnsId).emit('checkNewNotice', checkNew)
    });

// user 가 채팅을 보냈을때 DB에 저장후 해당 Room과 다른 User Room 에도 뿌려준다.
socket.on('room', async ({ fromSnsId, toSnsId, chatText, createdAt }) => {
        ...
				const roomName = await roomNameCreator(fromSnsId, toSnsId)
        io.to(roomName).emit('chat', chatMessage);
				io.to(toSnsId).emit('chat', chatMessage);
				...
  ```
  ![image](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/eeaad0e1-9055-40cd-933d-6bd0168f74e5/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA_2022-04-02_03.21.49.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20220409%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20220409T051849Z&X-Amz-Expires=86400&X-Amz-Signature=9e28535f78736bb163a70cf86bf4cf64f003c163b3a260fd52c092157d397582&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22%25E1%2584%2589%25E1%2585%25B3%25E1%2584%258F%25E1%2585%25B3%25E1%2584%2585%25E1%2585%25B5%25E1%2586%25AB%25E1%2584%2589%25E1%2585%25A3%25E1%2586%25BA%25202022-04-02%252003.21.49.png%22&x-id=GetObject)
  
  유저가 로그인 시 본인의 ID로 된 Room 에 접속하게 하게 한 후 채팅 시 Room과 해당 유저 Room 에 동시에 이벤트를 송신하여 채팅방 접속 여부에 상관없이 실시간으로 데이터를 받을수 있도록 했다.

채팅방에 입장할 땐 기존의 Room 연결을 끊고, 고유 roomName로 사용하여 새로운 연결을 해주고 채팅방에서 나올 때는 이 과정을 반대로 해줌. 이렇게 해서 유저는 채팅방 입장 시 같은 roomName를 통해 채팅이 가능하고 채팅방을 빠져나와서도 각자의 소켓주소를 통해 실시간 알림을 받을 수 있는 조건이 마련됨.

위에서 마련된 조건을 통해 채팅메세지뿐만 아니라클라이언트에서 새로운 이벤트가 발생 시 해당 유저의 소켓으로 emit을 하도록 하고, 서버에선 on으로 이벤트를 받아 해당 유저의 알림창으로 이벤트의 발생을 알려줄 수 있게됨.
  
  ![image](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/eda2df5d-7451-4b4a-ab08-8b3d03ac1b8f/%ED%99%94%EB%A9%B4_%EC%BA%A1%EC%B2%98_2022-04-01_013827.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20220409%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20220409T051936Z&X-Amz-Expires=86400&X-Amz-Signature=cb484e374304f57c7f1ebdf4c73466e9ac40657d0a6e991ba5bcabf0d5a1ea7f&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22%25ED%2599%2594%25EB%25A9%25B4%2520%25EC%25BA%25A1%25EC%25B2%2598%25202022-04-01%2520013827.jpg%22&x-id=GetObject)
  
</div>
</details>
  
<details>
  <summary> <h3>인기순으로 정렬하기</h3></summary>
<div markdown="1">
  
  ### 요구사항
  
  메인페이지에서 DB에 있는 “좋아요”, “북마크” 처럼 분야별로 표현하는 것이 아닌, 가장 인기가 많은 게시물을 노출시키기 위해  모든 분야의 개수를 다 더해준 새로운 값(totalcount)이 필요했다.

기존에 좋아요 개수, 북마크 개수를 표현할 때는 해당 게시글이나 댓글의 _id가 포함된 도큐먼트를 전부 count해서 mongoose기능인 VirtualField를 생성 후 populate로 해당 VirtualField를 response 했으므로 같은 방식으로 접근하여 totalcount를 정렬하려 했는데 sort는 DB에 있는 field 기준으로 정렬은 가능하지만  virtual로 정의된 스키마는 mongoDB에서 제공하는 query를 사용할 수 없기 때문에 사용이 불가능했다.
  
  ### 선택지
  
  1. 각각의 컬렉션에 새로운 필드를 만들어주어 그 필드에 count된 값을 넣어줄 생각을 했다.
  
  2. mongoDB에서 제공하는 aggregate라는 기능을 사용하기.
  
  ### 의사결정 및 근거
  
  - aggregate 사용하기.
    
    lookup으로 DB에 있는 값을 가져와서 addFields(mongoDB 4.2버전부터 추가)를 통해 totalcount를 생성하고 sort해주었다. aggregate는 virtual처럼 mongoose에서 처리해주는 것이 아니고 mongoDB에서 처리하므로 sort가 가능했다.
    
    totalcount는 해당 로직 내에서만 존재하기 때문에 DB에 insert,update하는 행위를 줄인다는 장점과 사용하지 않는 필드를 불러오면서 발생하는 비용을 없앨 수 있다는 장점을 얻을 수 있었다.
  
</div>
</details>
