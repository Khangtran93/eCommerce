import { Helmet } from "react-helmet-async"

const Meta = ({title, description, keyword}) => {
  return (
    <Helmet>
        <title>{title}</title>
        <meta name='description' content={description}/>
        <meta name='keyword' content={keyword}/>
    </Helmet>
  )
}
Meta.defaultProps = {
    title: "Welcome to playTech",
    description: "Your tech stop is here",
    keyword: "No trade off between price and quality"
}

export default Meta