import React ,{ useEffect, useState} from 'react';
import {Link , useNavigate} from "react-router-dom";
import {useAuth} from "../../hooks/useAuth";
import axios from 'axios';
import Pagination from './Layouts/Pagination';

const FilterResult = ({setIsFiltered}) =>{
	
	const {getTokenData,setLogout} = useAuth();
	const [buyerData, setBuyerData] = useState([]);
	const [pageNumber, setPageNumber] = useState(1);
	
	const [totalRecord,setTotalRecord] = useState(0);
	const [currentRecord,setCurrentRecord] = useState(0);
	const [currentPageNo,setCurrentPageNo] = useState(1);
	const [fromRecord,setFromRecord] = useState(0);
	const [toRecord,setToRecord] = useState(0);
	const [totalPage,setTotalPage] = useState(1);

	const [showLoader,setShowLoader] = useState(false);


	useEffect(() => {
		if(localStorage.getItem('get_filtered_data') !== null){
			if(localStorage.getItem('filter_buyer_fields') !== null){			
				let res = JSON.parse(localStorage.getItem('get_filtered_data'));				
				addBuyerDetails(res);
			}
		}
    }, []);	

	const getFilteredBuyers = async (page='') => {
		try{
			const apiUrl = process.env.REACT_APP_API_URL;
			let searchFields = JSON.parse(localStorage.getItem('filter_buyer_fields'));
	
			searchFields.filterType = 'my_buyer'
			searchFields.activeTab  = 'my_buyers';
			let headers = { 
				'Accept': 'application/json',
				'Authorization': 'Bearer ' + getTokenData().access_token,
				'auth-token' : getTokenData().access_token,
			};
			let url = apiUrl+'buy-box-search';
			if(page>1){
				url = apiUrl+'buy-box-search?page='+page;
			}
			let response = await axios.post(url, searchFields, { headers: headers });
			if(response){
				addBuyerDetails(response.data);
			}
		}catch(error){
			if(error.response.status === 401){
				setLogout();
			}
		}
	}

	const addBuyerDetails = (buyer_data) => {
		setBuyerData(buyer_data.buyers.data)
			
		setCurrentRecord(buyer_data.buyers.data.length);
		setTotalRecord(buyer_data.total_records);
		setTotalPage(buyer_data.buyers.last_page);
		setCurrentPageNo(buyer_data.buyers.current_page);
		setFromRecord(buyer_data.buyers.from);
		setToRecord(buyer_data.buyers.to);
		
		setShowLoader(false);
	}

	const handleBackClick = () => {
		if(localStorage.getItem('get_filtered_data') !== null){
			localStorage.removeItem('get_filtered_data');
		}
		setIsFiltered(false)
		window.history.pushState(null, "", "/sellers-form")
	}

	const handlePagination = (page_number) =>{
		if(localStorage.getItem('get_filtered_data') !== null){
			localStorage.removeItem('get_filtered_data');
		}
		setShowLoader(true);

		setPageNumber(page_number);

		if(localStorage.getItem('filter_buyer_fields') !== null){
			getFilteredBuyers(page_number);
		} 
	} 
	
 return (
    <>
	{ (showLoader)?<div className="loader" style={{textAlign:'center'}}><img src="../../../assets/images/loader.svg"/></div>:
		<section className="main-section position-relative pt-4 pb-120">
			<div className="container position-relative">
				<div className="back-block">
					<div className="row">
						<div className="col-12 col-sm-4 col-md-4 col-lg-4">
							<a onClick={handleBackClick} style={{ cursor: 'pointer'}} className="back">
								<svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path d="M15 6H1" stroke="#0A2540" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
									<path d="M5.9 11L1 6L5.9 1" stroke="#0A2540" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
								</svg>
								Back
							</a>
						</div>
						<div className="col-12 col-sm-4 col-md-4 col-lg-4">
							<h6 className="center-head text-center mb-0">My Buyers</h6>
						</div>
						<div className="col-12 col-sm-4 col-md-4 col-lg-4">
							<p className="page-out mb-0 text-center text-sm-end text-md-end text-lg-end">{currentPageNo } out of {totalPage}</p>
						</div>
					</div>
				</div>
				<div className="card-box bg-white-gradient">
					<div className="row">
						<div className="col-12 col-lg-12">
							{ (totalRecord == 0)?<div className="card-box-inner"> <h5>No Data Found</h5> </div>: 
								<div className="card-box-inner">
									<h3 className="text-center">Property Criteria Match With {totalRecord} Buyers</h3>
									<div className="property-critera">
										<div className="row ">
											{ buyerData.map((data) => { 
											return(<div className="col-12 col-lg-6" key={data.id}>
												<div className="property-critera-block">
													<div className="critera-card">
														<div className="center-align">
															<span className="price-img">
																<img src="./assets/images/price.svg" className="img-fluid" /></span>
															<p>Buyer</p>
														</div>
													</div>
													<div className="property-critera-details">
														<ul className="list-unstyled mb-0">
															<li>
																<span className="detail-icon">
																	<img src="./assets/images/user-gradient.svg" className="img-fluid" />
																</span>
																<span className="name-dealer">{data.first_name} {data.last_name}</span>
															</li>
															<li>
																<span className="detail-icon">
																	<img src="./assets/images/phone-gradient.svg" className="img-fluid" /></span>
																<a href={'tel:+1'+data.phone} className="name-dealer">+1 {data.phone}</a>
															</li>
															<li>
																<span className="detail-icon">
																	<img src="./assets/images/email.svg" className="img-fluid"/></span>
																<a href={'mailto:'+data.email} className="name-dealer email-tag">{data.email}</a>
															</li>
														</ul>
													</div>
												</div>
											</div>)})}
										</div>
										<div className="row justify-content-center">
											{(totalPage>1) ?
											<Pagination
												totalPage={totalPage}
												currentPage={pageNumber}
												onPageChange={handlePagination}
											/>:''}
											
											<div className="col-12 col-lg-12">
												<div className="want-to-see">
													<h3 className="text-center">Want to see more buyer!</h3>
													<Link className="btn btn-fill" to={'/seller/choose-your-plan'}>Click Here</Link>
												</div>
											</div>
										</div>
									</div>
								</div>
							}
						</div>
					</div>
				</div>
			</div>
		</section>
	}
    </>
 )
}
export default FilterResult;
