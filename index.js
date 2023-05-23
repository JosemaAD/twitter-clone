import { tweetsData } from './data.js'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

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
    else if(e.target.dataset.replyBtn){
        handleReplyBtnClick(e.target.dataset.replyBtn)
    }
})
 
// function to like
function handleLikeClick(tweetId){ 
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]

    if (targetTweetObj.isLiked){
        targetTweetObj.likes--
    }
    else{
        targetTweetObj.likes++ 
    }
    targetTweetObj.isLiked = !targetTweetObj.isLiked
    render()
}

// function to retweet
function handleRetweetClick(tweetId){
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    
    if(targetTweetObj.isRetweeted){
        targetTweetObj.retweets--
        tweetsData.shift()
    }
    else{
        targetTweetObj.retweets++
        let newTweetRetweetedData = {}
        newTweetRetweetedData.handle = targetTweetObj.handle
        newTweetRetweetedData.profilePic = targetTweetObj.profilePic
        newTweetRetweetedData.likes = 0
        newTweetRetweetedData.retweets = 0
        newTweetRetweetedData.tweetText = targetTweetObj.tweetText
        newTweetRetweetedData.isLiked = false
        newTweetRetweetedData.isRetweeted = false
        newTweetRetweetedData.replies = []
        newTweetRetweetedData.uuid = uuidv4()
        newTweetRetweetedData.retweet = true
        tweetsData.unshift(newTweetRetweetedData)        
    }

    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted

    render()

}

// function to show replies
function handleReplyClick(replyId){
    document.getElementById(`replies-${replyId}`).classList.toggle('hidden')
}

// function to tweet
function handleTweetBtnClick(){
    const tweetInput = document.getElementById('tweet-input')
console.log(tweetInput.value)
    if(tweetInput.value){
        tweetsData.unshift({
            handle: `@Scrimba`,
            profilePic: `images/scrimbalogo.png`,
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: uuidv4()
        })
    render()
    tweetInput.value = ''
    }
}

// function to reply
function handleReplyBtnClick(tweetId){
    
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    

    const replyTweetInput = document.querySelector(`[data-textarea="${tweetId}"]`)  
    console.log(replyTweetInput)
    
    if(replyTweetInput.value){
        targetTweetObj.replies.unshift({
            handle: `@Scrimba`,
            profilePic: `images/scrimbalogo.png`,
            tweetText: replyTweetInput.value,
        })
    
    replyTweetInput.value = ''
    }

    render()

}

// function to get feed HTML
function getFeedHtml(){
    let feedHtml = ``
    
    tweetsData.forEach(function(tweet){
        
        let likeIconClass = ''
        
        if (tweet.isLiked){
            likeIconClass = 'liked'
        }
        
        let retweetIconClass = ''
        
        if (tweet.isRetweeted){
            retweetIconClass = 'retweeted'
        }
        
        let retweetClass = 'hidden'
        if(tweet.retweet){
            retweetClass = 'retweet'
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
                        <div class="${retweetClass}"">
                            <i class="fa-solid fa-retweet"></i> @Scrimba retweeted
                        </div>
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
                                </div>   
                            </div>            
                        </div>
                        <div class="hidden" id="replies-${tweet.uuid}">
                            ${repliesHtml}
                            <div class="tweet-reply">
                                <div class="tweet-input-area">
                                    <img src="images/scrimbalogo.png" class="profile-pic">
                                    <textarea placeholder="Tweet your answer" data-textarea="${tweet.uuid}"></textarea>
                                </div>
                                <button data-reply-btn="${tweet.uuid}">Reply</button>
                            </div>
                        </div>   
                    </div>
`
   })
   return feedHtml 
}

// function to render
function render(){
    document.getElementById('feed').innerHTML = getFeedHtml()
}

render()

