import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { createBrowserHistory as createHistory } from 'history';
import 'bootstrap/dist/css/bootstrap.min.css';
import LoginPage from './new-components/LoginPage';
import NavSidebar from './new-components/NavSidebar';
import Property from './new-components/Property/Property';
import Career from './new-components/Career/Career';
import Blogs from './new-components/Blogs/Blogs';
import AddBlogForm from './new-components/Blogs/AddBlogForm';
import FeaturedProject from './new-components/FeaturedProjects/FeaturedProject';
import EditBlogForm from './new-components/Blogs/EditBlogForm';
import AddCareerForm from './new-components/Career/AddCareerForm';
import EditCareerForm from './new-components/Career/EditCareerForm';
import AddFeaturedProjectForm from './new-components/FeaturedProjects/AddFeaturedProjectForm';
import EditFeaturedProjectForm from './new-components/FeaturedProjects/EditFeaturedProjectForm';
import TrendingLoans from './new-components/TrendingLoans/TrendingLoans';
import AddTrendingLoansForm from './new-components/TrendingLoans/AddTrendingLoansForm';
import EditTrendingLoansForm from './new-components/TrendingLoans/EditTrendingLoansForm';
import AddPropertyForm from './new-components/Property/AddPropertyForm';
import EditPropertyForm from './new-components/Property/EditPropertyForm';
import Requirements from './new-components/Requirements/Requirements';
import ContactUs from './new-components/ContactUs/ContactUs';
import UnitDetails from './new-components/UnitDetails/UnitDetails';
import AddUnitDetailsForm from './new-components/UnitDetails/AddUnitDetailsForm';
import AddDeveloperForm from './new-components/Developer/AddDeveloperForm';
import EditDeveloperForm from './new-components/Developer/EditDeveloperForm';
import Dashboard from './new-components/Dashboard/Dashboard';
import User from './new-components/Experts/User';
export const history = createHistory();
const App = () => {
  return (
    <Router history={history}>
      <Switch>
        <Route path="/" exact component={LoginPage} />
        <NavSidebar>
          <Route path="/all" exact component={Property} />
          <Route path="/users" exact component={User} />
          <Route path="/dashboard" exact component={Dashboard} />
          <Route path="/all/add" exact component={AddPropertyForm} />
          <Route path="/property/edit/:id/" component={EditPropertyForm} />
          <Route
            path="/property/unitdetail/:id"
            exact
            component={UnitDetails}
          />
          <Route
            path="/property/unitdetail/add/:id"
            exact
            component={AddUnitDetailsForm}
          />
          <Route
            path="/property/adddev/:id"
            exact
            component={AddDeveloperForm}
          />
          <Route
            path="/property/editdev/:id"
            exact
            component={EditDeveloperForm}
          />
          <Route path="/prop/req" exact component={Requirements} />
          <Route path="/career" exact component={Career} />
          <Route path="/career/add" exact component={AddCareerForm} />
          <Route path="/career/edit/:id" exact component={EditCareerForm} />
          <Route path="/blogs" exact component={Blogs} />
          <Route path="/blog/add" exact component={AddBlogForm} />
          <Route path="/blog/edit/:id/" component={EditBlogForm} />
          <Route path="/featuredprojects" exact component={FeaturedProject} />
          <Route
            path="/featuredprojects/add"
            exact
            component={AddFeaturedProjectForm}
          />
          <Route
            path="/featuredprojects/edit/:id"
            component={EditFeaturedProjectForm}
          />
          <Route path="/trendingloans" exact component={TrendingLoans} />
          <Route
            path="/trendingloans/add"
            exact
            component={AddTrendingLoansForm}
          />
          <Route
            path="/trendingloans/edit/:id"
            component={EditTrendingLoansForm}
          />
          <Route path="/contacts" exact component={ContactUs} />
        </NavSidebar>
      </Switch>
    </Router>
  );
};

export default App;
