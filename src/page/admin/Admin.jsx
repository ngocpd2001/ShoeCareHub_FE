
import ChartOne from "../../Components/Charts/ChartOne";
import ChartTwo from './../../Components/Charts/ChartTwo';
import ChartThree from './../../Components/Charts/ChartThree';
import ChartFour from './../../Components/Charts/ChartFour';

function Admin() {

  return (
    <>
      <div className="grid grid-cols-12 gap-4 md:gap-6 2xl:gap-7.5">
        <ChartOne />
        <ChartTwo />
        <ChartThree />
        <ChartFour />
      </div>
    </>
  );
}

export default Admin;
