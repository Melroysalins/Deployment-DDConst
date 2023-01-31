// components
import Page from '../components/Page';

// ----------------------------------------------------------------------

export default function HrAdmin() {
  return (
    <Page title="Dashboard: Blog">
      <iframe
        title="hr admin"
        frameBorder="0"
        scrolling="yes"
        seamless="seamless"
        style={{display:"block", width:"100%", height:"100vh"}}
        src="https://ddconst.budibase.app/app/hradmin#/employees"
      />
    </Page>
  );
}
