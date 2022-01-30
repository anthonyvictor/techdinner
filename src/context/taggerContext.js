import React, { createContext, useState } from 'react';

const TaggerContext = createContext()

function TaggerProvider(props) {
  const [tags, setTags] = useState(props.tags)

    return <div />;
}

export default TaggerProvider;