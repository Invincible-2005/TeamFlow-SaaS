export function getAvatar(userPictur : string| null, userEmail: string){
    return userPictur ?? `https://avatar.vercel.sh/${userEmail}`;
}