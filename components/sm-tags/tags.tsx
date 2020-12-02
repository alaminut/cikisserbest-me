import React from 'react';

type Props = {
  readonly title: string
  readonly description: string
  readonly image: string
  readonly url: string
}

const SmTags = ({ title, description, image, url }: Props) => (
  <>
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content={image} />
    <meta property="og:url" content={url} />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    <meta name="twitter:image" content={image} />
    <meta name="twitter:card" content="summary_large_image" />
  </>
);

export default SmTags;