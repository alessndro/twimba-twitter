import { tweetsData } from './data.js'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

const followingAmountElement = document.getElementById('following-amount')
const followersAmountElement = document.getElementById('followers-amount')

const followersData = [
    {
        name: `@Elon_Musk`,
        isFollowed: false,
    },
    {
        name: `@Noobcod9`,
        isFollowed: false,
    },
     {
        name: `@Tcruise12`,
        isFollowed: false,
    },
]

const profileData = [
    {
        name: '@Scrimba',
        following: 121,
        followers: 321,
        friendsRequestsAmount: 4,
        friendsRequests: [
            '@AlessandroD', '@Stevie-Wond69', '@JuliaMedeiros', '@Dexter1112'
        ],
    }
]

// Check if 'storedArray' key is already present in localStorage
if (!localStorage.getItem('storedArray')) {
  // Populate localStorage with the dataset values
  localStorage.setItem('storedArray', JSON.stringify(tweetsData))
}

// Check if 'followersArray' key is already present in localStorage
if (!localStorage.getItem('followersArray')) {
  // Populate localStorage with the dataset values
  localStorage.setItem('followersArray', JSON.stringify(followersData))
}

// Check profile info is already present in localStorage
if (!localStorage.getItem('profileArray')) {
  // Populate localStorage with the dataset values
  localStorage.setItem('profileArray', JSON.stringify(profileData))
}


document.addEventListener('click', function(e){
    if(e.target.dataset.like){
       handleLikeClick(e.target.dataset.like) 
    }
    else if(e.target.dataset.retweet){
        handleRetweetClick(e.target.dataset.retweet)
    }
    else if(e.target.dataset.reply){
        handleReplyClick(e.target.dataset.reply)
    }
    else if(e.target.id === 'tweet-btn'){
        handleTweetBtnClick()
    }
     else if(e.target.id === 'reset-btn'){
        resetBtn()
    }
    else if(e.target.dataset.remove){
        handleDeleteClick(e.target.dataset.remove)
    }
    else if(e.target.id === 'modal-close')
    {
        document.getElementById('modal').classList.add('hidden')
    }
    else if(e.target.dataset.follow)
    {
        handleFollowButton(e.target.dataset.follow)
    }
     else if(e.target.dataset.requestDecline)
    {
        requestDecline(e.target.dataset.requestDecline)
    }
     else if(e.target.dataset.requestAccept)
    {
        requestAccept(e.target.dataset.requestAccept)
    }
})
 
function handleLikeClick(tweetId){ 
    const storedArray = JSON.parse(localStorage.getItem('storedArray'))
    const targetTweetObj = storedArray.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]

    if (targetTweetObj.isLiked){
        targetTweetObj.likes--
    }
    else{
        targetTweetObj.likes++ 
    }
    targetTweetObj.isLiked = !targetTweetObj.isLiked
    localStorage.setItem('storedArray', JSON.stringify(storedArray))
    render()
}

function handleRetweetClick(tweetId){
    const storedArray = JSON.parse(localStorage.getItem('storedArray'))
    const targetTweetObj = storedArray.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    
    if(targetTweetObj.isRetweeted){
        targetTweetObj.retweets--
    }
    else{
        targetTweetObj.retweets++
    }
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted
    localStorage.setItem('storedArray', JSON.stringify(storedArray))
    render() 
}

function handleReplyClick(replyId){
    document.getElementById(`replies-${replyId}`).classList.toggle('hidden')
}

function handleTweetBtnClick(){
    const tweetInput = document.getElementById('tweet-input')
    const storedArray = JSON.parse(localStorage.getItem('storedArray'))
    
    if(tweetInput.value){
        storedArray.unshift({
            handle: `@Scrimba`,
            profilePic: `/scrimbalogo.png`,
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: uuidv4()
        })
    localStorage.setItem('storedArray', JSON.stringify(storedArray))
    render()
    tweetInput.value = ''
    }

}

function handleDeleteClick(tweetId)
{
    const storedArray = JSON.parse(localStorage.getItem('storedArray'))
    // Check whether user is trying to delete own tweet
    const deleteTweet = storedArray.filter(function(tweet)
    {
        return tweet.handle === `@Scrimba` && tweet.uuid === tweetId
    })
    
    // If user deletes own message, show modal controlling correct behavior
    if (deleteTweet.length > 0)
    {
        document.getElementById('modal').classList.remove('hidden')
    }
    
    // Add event listener to button div, look for specific yes/no id
    const buttonWrapper = document.getElementById('button-wrapper')
    buttonWrapper.addEventListener('click', function(event)
    {   
        if (event.target.id === 'yes-btn')
        {   
            // If user want delete, create array without specifc delete tweet
            const storedArray1 = storedArray.filter(function(object)
            {
                return object.uuid !== deleteTweet[0].uuid
            })
            // Store new array without tweet in localStorage
            localStorage.setItem('storedArray', JSON.stringify(storedArray1))
            
            // Hide modal and render page
            document.getElementById('modal').classList.add('hidden')
            render()
        }
        // If user dont delete, hide modal, no new render, nothing changed
        else
        {
            document.getElementById('modal').classList.add('hidden')
        }
     })
}

function handleFollowButton(personToFollow)
{    
    // Get correct person to follow from data
    const followersArray = JSON.parse(localStorage.getItem('followersArray')) 
    const personToFollowArray = followersArray.filter(function(follower)
    {  
        return follower.name === personToFollow
    })
    
    //  Get correct current profile information
    const profileArray = JSON.parse(localStorage.getItem('profileArray'))
    
    
    if (personToFollowArray[0].isFollowed)
    {
         // Get profile information's following amount, increase with 1, follow user
        profileArray[0].following--
        followingAmountElement.innerHTML = profileArray[0].following
        personToFollowArray[0].isFollowed = false
        
        // Update button
        document.getElementById(personToFollow).classList.remove('button-followed')
        
        // Update local storage
        localStorage.setItem('followersArray', JSON.stringify(followersArray))
        localStorage.setItem('profileArray', JSON.stringify(profileArray))
    }
    // Not yet follow
    else
    {
        // Get profile information's following amount, increase with 1, follow user
        profileArray[0].following++
        followingAmountElement.innerHTML = profileArray[0].following
        personToFollowArray[0].isFollowed = true
       
        // Update button
        document.getElementById(personToFollow).classList.add('button-followed')
        
        // Update local storage
        localStorage.setItem('followersArray', JSON.stringify(followersArray))
        localStorage.setItem('profileArray', JSON.stringify(profileArray))
    }   
}

function requestAccept(requestUser)
{
   
    // Get correct person to follow from data
    const profileArray = JSON.parse(localStorage.getItem('profileArray')) 
     
    let newFriendsRequests = []
    newFriendsRequests = profileArray[0].friendsRequests.filter(function(request)
    {  
        return request !== requestUser
    })
    
    profileArray[0].friendsRequestsAmount = newFriendsRequests.length
    profileArray[0].friendsRequests = newFriendsRequests
    profileArray[0].followers++
    followersAmountElement.innerHTML = profileArray[0].followers
    
    // //  Get correct current profile information
    // const profileArray = JSON.parse(localStorage.getItem('profileArray'))
    localStorage.setItem('profileArray', JSON.stringify(profileArray))
    getRequestsHtml()
    render()
}

function requestDecline(requestUser)
{
    // Get correct person to follow from data
    const profileArray = JSON.parse(localStorage.getItem('profileArray')) 
     
    let newFriendsRequests = []
    newFriendsRequests = profileArray[0].friendsRequests.filter(function(request)
    {  
        return request !== requestUser
    })
    
    profileArray[0].friendsRequestsAmount = newFriendsRequests.length
    profileArray[0].friendsRequests = newFriendsRequests
    

    // //  Get correct current profile information
    console.log(profileArray)
    // const profileArray = JSON.parse(localStorage.getItem('profileArray'))
    localStorage.setItem('profileArray', JSON.stringify(profileArray))
    getRequestsHtml()
    render()
}

function resetBtn()
{
    localStorage.clear()
    location.reload()
}

function getFeedHtml(){
    let feedHtml = ``
    
    const storedArray = JSON.parse(localStorage.getItem('storedArray'))
    storedArray.forEach(function(tweet){
        
        let likeIconClass = ''
        
        if (tweet.isLiked){
            likeIconClass = 'liked'
        }
        
        let retweetIconClass = ''
        
        if (tweet.isRetweeted){
            retweetIconClass = 'retweeted'
        }
        
        let repliesHtml = ''
        
        if(tweet.replies.length > 0){
            tweet.replies.forEach(function(reply){
                repliesHtml+=`
<div class="tweet-reply">
    <div class="tweet-inner">
        <img src="${reply.profilePic}" class="profile-pic">
            <div>
                <p class="handle">${reply.handle}</p>
                <p class="tweet-text">${reply.tweetText}</p>
            </div>
        </div>
</div>
`
            })
        }
        
          
        feedHtml += `
<div class="tweet">
    <div class="tweet-inner">
        <img src="${tweet.profilePic}" class="profile-pic">
        <div>
            <p class="handle">${tweet.handle}</p>
            <p class="tweet-text">${tweet.tweetText}</p>
            <div class="tweet-details">
                <span class="tweet-detail">
                    <i class="fa-regular fa-comment-dots"
                    data-reply="${tweet.uuid}"
                    ></i>
                    ${tweet.replies.length}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-heart ${likeIconClass}"
                    data-like="${tweet.uuid}"
                    ></i>
                    ${tweet.likes}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-retweet ${retweetIconClass}"
                    data-retweet="${tweet.uuid}"
                    ></i>
                    ${tweet.retweets}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-trash"
                    data-remove="${tweet.uuid}"
                    ></i>
                </span>
            </div>   
        </div>            
    </div>
    <div class="hidden" id="replies-${tweet.uuid}">
        ${repliesHtml}
    </div>   
</div>
`
   })
   return feedHtml 
}

function getRequestsHtml()
{
    //  Get correct current profile information
    const profileArray = JSON.parse(localStorage.getItem('profileArray'))
    
    let requestHtml = ''
    profileArray[0].friendsRequests.forEach(function(request)
    {
        requestHtml += `
        <li class='requests-row'>
        <img class='tofollow-img' src='/${request}.jpg' alt='face Person screaming'>
            <p>${request}</p>
            <div class="icon-wrapper">
                <i data-request-accept="${request}" class="fa-solid fa-check-circle blue-hover">
                </i>
                <i data-request-decline="${request}"class="fa-solid fa-circle-xmark blue-hover">
                </i>
            </div>
        </li>`
    })
    return requestHtml
}

function getProfileFollowing()
{
    const profileArray = JSON.parse(localStorage.getItem('profileArray'))
    return profileArray[0].following 
}

function getProfileFollowers()
{
    const profileArray = JSON.parse(localStorage.getItem('profileArray'))
    return profileArray[0].followers 
}

function render(){
    document.getElementById('feed').innerHTML = getFeedHtml()
    document.getElementById('requests-list').innerHTML = getRequestsHtml()
    document.getElementById('following-amount').innerHTML = getProfileFollowing()
    document.getElementById('followers-amount').innerHTML = getProfileFollowers()
}

render()

