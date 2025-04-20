import React, { memo } from 'react';

const PostList = memo(({ posts, currentPage, postsPerPage, onPostClick, formatDate }) => {
    if (posts.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">게시글이 없습니다.</div>
        );
    }

    return (
        <>
            {posts.map((post, index) => (
                <div key={post.id} className="flex border-t">
                    <div className="w-1/12 py-2 px-4 text-center">
                        {(currentPage - 1) * postsPerPage + index + 1}
                    </div>
                    <div
                        className="w-6/12 py-2 px-4 cursor-pointer text-blue-600 hover:underline"
                        onClick={() => onPostClick(post.id)}
                    >
                        {post.title}
                    </div>
                    <div className="w-2/12 py-2 px-4 text-center">{post.userName}</div>
                    <div className="w-2/12 py-2 px-4 text-center whitespace-nowrap">
                        {formatDate(post.createdAt)}
                    </div>
                    <div className="w-1/12 py-2 px-4 text-center">{post.views}</div>
                </div>
            ))}
        </>
    );
});

export default PostList; 