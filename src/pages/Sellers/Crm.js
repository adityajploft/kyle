import React, { useEffect, useMemo, useState } from 'react';
import Header from "../../partials/Header";
import Footer from "../../partials/Footer";
import { Button, Col, Container, Form, Image, Row } from 'react-bootstrap';
import axios from "axios";
import { useAuth } from "../../hooks/useAuth";
import { toast } from "react-toastify";
import {
  DragDropContext,
  Droppable,
  Draggable
} from "@hello-pangea/dnd";

const emptyBoard = {
  columns: {},
  columnOrder: []
};

const formatTimeAgo = (dateString) => {
  if (!dateString) return "";

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "";

  const diffInSeconds = Math.floor((Date.now() - date.getTime()) / 1000);
  const units = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
  ];

  for (const unit of units) {
    const value = Math.floor(diffInSeconds / unit.seconds);
    if (value >= 1) {
      return `${value} ${unit.label}${value > 1 ? "s" : ""} ago`;
    }
  }

  return "Just now";
};

const getDealAddress = (deal) => {
  const address = deal?.search_log?.address || deal?.address;
  const locationParts = [
    deal?.search_log?.city || deal?.city,
    deal?.search_log?.state || deal?.state,
    deal?.search_log?.zip_code || deal?.zip_code,
  ].filter(Boolean);

  return address || locationParts.join(", ") || "No address available";
};

const getBuyerName = (deal) => {
  return deal?.buyer_user?.name || deal?.buyer_deals?.[0]?.buyer_user?.name || "Buyer";
};

const getBuyerDealId = (deal) => {
  return deal?.buyer_deal_id || deal?.buyer_deals?.[0]?.id || deal?.id;
};

const mapCrmStagesToBoard = (stages = []) => {
  const columns = {};
  const columnOrder = [];

  stages.forEach((stage) => {
    const columnId = `stage-${stage.stage || stage.key}`;
    columnOrder.push(columnId);

    columns[columnId] = {
      id: columnId,
      stage: stage.stage,
      title: stage.label || stage.key || "Untitled Stage",
      key: stage.key,
      // isRestricted: stage.is_restricted === true || stage.is_restricted === 1 || stage.is_restricted === "1" || stage.is_restricted === "true",
      items: (stage.deals || []).map((deal, index) => ({
        id: `${columnId}-deal-${deal.id}-${index}`,
        dealId: getBuyerDealId(deal),
        title: getBuyerName(deal),
        content: getDealAddress(deal),
        time: formatTimeAgo(deal?.search_log?.created_at || deal?.created_at),
        raw: deal,
      })),
    };
  });

  return { columns, columnOrder };
};

const Crm = () => {
  const { getTokenData, setLogout } = useAuth();
  const apiUrl = process.env.REACT_APP_API_URL;
  const [data, setData] = useState(emptyBoard);
  const [searchText, setSearchText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchCrmData = async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const token = getTokenData()?.access_token;
      const headers = {
        Accept: "application/json",
        Authorization: "Bearer " + token,
        "auth-token": token,
      };

      const response = await axios.get(`${apiUrl}seller-crm`, { headers });
      const stages = response.data?.data?.crm_stages || [];
      setData(mapCrmStagesToBoard(stages));
    } catch (error) {
      if (error?.response?.status === 401) {
        setLogout();
        return;
      }

      setErrorMessage("Unable to load CRM data.");
      console.log("seller crm error", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCrmData();
  }, []);

  const visibleData = useMemo(() => {
    const query = searchText.trim().toLowerCase();
    if (!query) return data;

    const columns = {};
    data.columnOrder.forEach((colId) => {
      const column = data.columns[colId];
      columns[colId] = {
        ...column,
        items: column.items.filter((item) => {
          return `${item.title} ${item.content}`.toLowerCase().includes(query);
        }),
      };
    });

    return { ...data, columns };
  }, [data, searchText]);

  const onDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) return;

    const previousData = data;
    const sourceCol = data.columns[source.droppableId];
    const destCol = data.columns[destination.droppableId];

    if (!sourceCol || !destCol) return;

    const isSearching = Boolean(searchText.trim());

    // if (source.droppableId !== destination.droppableId && (sourceCol.isRestricted || destCol.isRestricted)) {
    //   toast.info("This deal is restricted and cannot be moved to another stage.", {
    //     position: toast.POSITION.TOP_RIGHT,
    //   });
    //   return;
    // }

    if (isSearching) {
      if (source.droppableId === destination.droppableId) return;

      const sourceVisibleItem = visibleData.columns[source.droppableId]?.items?.[source.index];
      if (!sourceVisibleItem) return;

      updateDealStage(sourceCol, destCol, sourceVisibleItem, previousData, true);
      return;
    }

    // SAME COLUMN
    if (source.droppableId === destination.droppableId) {
      const newItems = Array.from(sourceCol.items);

      const [moved] = newItems.splice(source.index, 1);
      newItems.splice(destination.index, 0, moved);

      const newColumn = {
        ...sourceCol,
        items: newItems
      };

      setData({
        ...data,
        columns: {
          ...data.columns,
          [newColumn.id]: newColumn
        }
      });
    } else {
      // MOVE BETWEEN COLUMNS
      const sourceItems = Array.from(sourceCol.items);
      const destItems = Array.from(destCol.items);

      const [moved] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, moved);

      const updatedData = {
        ...data,
        columns: {
          ...data.columns,
          [sourceCol.id]: {
            ...sourceCol,
            items: sourceItems
          },
          [destCol.id]: {
            ...destCol,
            items: destItems
          }
        }
      };

      setData(updatedData);
      updateDealStage(sourceCol, destCol, moved, previousData);
    }
  };

  const updateDealStage = async (sourceCol, destCol, movedDeal, previousData, shouldRefresh = false) => {
    try {
      const token = getTokenData()?.access_token;
      const headers = {
        Accept: "application/json",
        Authorization: "Bearer " + token,
        "auth-token": token,
      };

      const payload = {
        current_stage: sourceCol.stage,
        updating_stage: destCol.stage,
        buyer_deal_id: movedDeal.dealId,
      };

      const response = await axios.post(`${apiUrl}seller-crm/update-deal-status`, payload, { headers });
      toast.success(response.data?.message || "Deal status updated successfully.", {
        position: toast.POSITION.TOP_RIGHT,
      });

      if (shouldRefresh) {
        await fetchCrmData();
      }
    } catch (error) {
      if (previousData) {
        setData(previousData);
      }

      if (error?.response?.status === 401) {
        setLogout();
        return;
      }

      toast.error(error?.response?.data?.message || "Unable to update deal status.", {
        position: toast.POSITION.TOP_RIGHT,
      });
      console.log("seller crm update error", error);
    }
  };


  return (
    <>
      <Header />
      <div className='crm_main'>
        <Container>
          <Row>
            <Col>
              <div className='crm_main_top'>
                <h2>Properties</h2>
                <Form className='position-relative crm_top_search'>
                  <Form.Group className="m-0">
                    <Form.Control
                      type="text"
                      placeholder="Search"
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                    />
                  </Form.Group>
                  <Button type="button" className='m-0 search_icon'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M11.0469 11.3984L14.4999 14.4984" stroke="#121639" strokeWidth="2" strokeLinecap="round"/>
                      <path d="M7 13C10.3137 13 13 10.3137 13 7C13 3.68629 10.3137 1 7 1C3.68629 1 1 3.68629 1 7C1 10.3137 3.68629 13 7 13Z" stroke="#121639" strokeWidth="2"/>
                    </svg>
                  </Button>
                </Form>
              </div>
            </Col>
          </Row>
        </Container>

        <div className='crm_main_data'>
          <DragDropContext onDragEnd={onDragEnd}>
            <div 
              style={{
                display: "flex",
                gap: "20px",
                overflowX: "auto",
                // overflowY: "auto",
                height: "calc(100vh - 266px)",
                alignItems: "flex-start",
                // minHeight: "calc(100vh - 266px)",
                paddingBottom: "50px"
              }}
              className='crm_cards_list'
            >
              {isLoading && <div className='crm_card_box p-3'>Loading...</div>}
              {!isLoading && errorMessage && <div className='crm_card_box p-3'>{errorMessage}</div>}
              {!isLoading && !errorMessage && visibleData.columnOrder.map((colId) => {
                const column = visibleData.columns[colId];
                return (
                  <Droppable droppableId={column.id} key={column.id}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        style={{
                          padding: "10px",
                          width: "312px",
                          maxWidth: "312px",
                          flexBasis: "312px",
                          flexShrink: "0",
                          borderRadius: "5px",
                          maxHeight: "calc(100vh - 324px)",
                          overflowY: "auto",
                        }}
                        className='crm_card_box'
                      >
                        <h3>{column.title}</h3>
                        {column.items.length === 0 && (
                          <div
                            style={{
                              padding: "14px",
                              marginBottom: "14px",
                              borderRadius: "5px",
                              width: "100%"
                            }}
                          >
                            <p className='mb-0'>No deals found.</p>
                          </div>
                        )}
                        {column.items.map((item, index) => (
                          <Draggable
                            draggableId={item.id}
                            index={index}
                            key={item.id}
                          >
                            {(provided, snapshot) => (
                              <>
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  style={{
                                    padding: "14px",
                                    marginBottom: "14px",
                                    // background: snapshot.isDragging
                                    //   ? "#d1e7dd"
                                    //   : "#FBFBFB",
                                    borderRadius: "5px",
                                    width: "100%",
                                    ...provided.draggableProps.style
                                  }}
                                >
                                  {/* {item.content} */}
                                  <h4>{item.title}</h4>
                                  <p>{item.content}</p>
                                  <div className='crm_inner_content'>
                                    <div className='crm_card_img'>
                                      <Image src="/assets/images/property-img.png" alt="" />
                                    </div>
                                    {item.time && <span className='crm_card_time'>{item.time}</span>}
                                  </div>
                                </div>
                              </>
                            )}
                          </Draggable>
                        ))}
                        {/* <button type='button' className='crm_create_btn'>
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <path d="M10.8333 6.66667H6.66667V10.8333C6.66667 11.2917 6.29167 11.6667 5.83333 11.6667C5.375 11.6667 5 11.2917 5 10.8333V6.66667H0.833333C0.375 6.66667 0 6.29167 0 5.83333C0 5.375 0.375 5 0.833333 5H5V0.833333C5 0.375 5.375 0 5.83333 0C6.29167 0 6.66667 0.375 6.66667 0.833333V5H10.8333C11.2917 5 11.6667 5.375 11.6667 5.83333C11.6667 6.29167 11.2917 6.66667 10.8333 6.66667Z" fill="#72787F"/>
                          </svg>
                          Create
                        </button> */}
                        {provided.placeholder}
                      </div>
                    )}  
                  </Droppable>
                );
              })}
              {/* <div className='add_more_crm_card'>
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M10.8333 6.66667H6.66667V10.8333C6.66667 11.2917 6.29167 11.6667 5.83333 11.6667C5.375 11.6667 5 11.2917 5 10.8333V6.66667H0.833333C0.375 6.66667 0 6.29167 0 5.83333C0 5.375 0.375 5 0.833333 5H5V0.833333C5 0.375 5.375 0 5.83333 0C6.29167 0 6.66667 0.375 6.66667 0.833333V5H10.8333C11.2917 5 11.6667 5.375 11.6667 5.83333C11.6667 6.29167 11.2917 6.66667 10.8333 6.66667Z" fill="#72787F"/>
                </svg>
              </div> */}
            </div>
          </DragDropContext>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default Crm
