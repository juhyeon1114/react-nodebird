import React from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';

const PostCardContent = ({ postData }) => (
  <div>
    {postData.split(/(#[^\s#]+)/g).map((v, i) => (v.match(/(#[^\s#]+)/g) ? <Link href={`/hashtag/${v.slice(1)}`} key={i}><a>{v}</a></Link> : v))}
  </div>
);

PostCardContent.ropTypes = {
  postData: PropTypes.string.isRequired,
};

export default PostCardContent;
