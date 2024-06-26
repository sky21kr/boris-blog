import { Link } from 'react-router-dom'
import { PostDto } from '../../dto/PostDto';
import styled from 'styled-components';
import { getParametersForUnsplash } from '../../utils/image';
import { useEffect, useRef } from 'react';

interface PostProps {
  post: PostDto;
}

const Post = ({ post }: PostProps) => {
  const imgRef = useRef(null);

  const substringWithZeroPad = (value: string | number, len: number) => {
    const str = '0000000000' + value.toString();
    return str.substring(str.length - len);
  }

  const getDateTime = () => {
    const createdTime = new Date(post.createdTime);
    return `${createdTime.getFullYear()}.${substringWithZeroPad(createdTime.getMonth() + 1, 2)}.${substringWithZeroPad(createdTime.getDate(), 2)}`
  }

  /*
  * TODO 7. - O
  * [렌더링 최적화 - 병목 코드 최적화] 
  * 많은 연산으로 병목을 일으키는 코드입니다.
  * 필요 이상의 모든 텍스트에 대해 계산하고 있습니다.
  * 파라미터로 넘어온 문자열에서 일부 특수문자를 제거하는 함수
  * */
  const removeSpecialCharacter = (str: string) => {
    const pattern = /[#_*~&;![\]`>\n=-]/g;
    return str.substring(0, 300).replace(pattern, '');
  }

  useEffect(() => {
		const callback: IntersectionObserverCallback = (entries, observer) => {
			entries.forEach(entry => {
        if (entry.isIntersecting) {
          // @ts-ignore
          entry.target.src = entry.target.dataset.src;
          observer.unobserve(entry.target);
        }
        
      });
		}
	
		const options = {}
		const observer = new IntersectionObserver(callback, options);

    if(imgRef.current) {
      observer.observe(imgRef.current);
    }

		return (() => {
			observer.disconnect();
		})
	}, [])

  return (
    <PostItem>
      <Link to={`/detail/${post.id}`}>
        <ItemArea>
          <div>
            {/* 
              * TODO 5. - O
              * [로딩 최적화 - 이미지 사이즈 최적화] 
              * 필요 이상의 큰 이미지 파일을 요청하여 로딩이 오래걸립니다.
              * 적절한 이미지의 사이즈는 영역 사이즈의 2배 정도 입니다.
              * 최적화된 이미지 포멧을 사용해 사이즈를 줄일 수 있습니다.
            */}        
            <ItemImg ref={imgRef} data-src={`${post.image}${getParametersForUnsplash({width: 256, height: 256, quality: 80, format: 'jpg'})}`} alt={'img'}/>
          </div>
          <ContentArea>
            <h2>{post.title}</h2>
            <ItemContent>
              {removeSpecialCharacter(post.content)}
            </ItemContent>
            <p>{getDateTime()}</p>
          </ContentArea>
        </ItemArea>
      </Link>
    </PostItem>
  )
}

const PostItem = styled.li`
  width: 100%;

  a {
    text-decoration: none; 
    color: initial;
  }
`

const ItemArea = styled.div`
  display: flex;
  gap: 24px;
  width: 100%;
  border: 1px solid #eee;
  padding: 12px;
`

const ContentArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
`

const ItemImg = styled.img`
  width: 128px;
  height: 128px;
  object-fit: cover;
  object-position: center;
`

const ItemContent = styled.p`
  overflow: hidden;
  width: 590px;
  white-space: normal;
  display:-webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
`

export default Post;