import FeatureProject from "./FeatureProject.tsx";
import HeroSection from "./HeroSection.tsx";
import HeaderFooter from "./HeaderFooter.tsx";

function Homepage() {
    return (
        <HeaderFooter isFixedHeader={true} isFixedFooter={true}>
            <div className="bg-black">
                <HeroSection />
                <FeatureProject />
            </div>
        </HeaderFooter>
    )
}

export default Homepage
