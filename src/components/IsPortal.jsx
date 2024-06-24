import React, { Component } from "react";
import {
  GridColumn,
  Button,
  Grid,
  Header,
  Segment,
  Portal,
  Container,
  Icon,
} from "semantic-ui-react";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";

const IsPortal = ({ header, children, label, isInverted = false, color, auxHook }) => {
  IsPortal.propTypes = {
    header: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    label: PropTypes.string.isRequired,
    isInverted: PropTypes.bool,
    color: PropTypes.string,
    auxHook: PropTypes.bool,
  };

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const enhancedChildren = React.Children.map(children, (child) =>
    React.cloneElement(child, { handleClose })
  );
  useEffect(() => {
    if(auxHook){
      handleClose()
    }
  })

  return (
    <Grid>
      <GridColumn>
        <Button
          content={label}
          disabled={open}
          inverted={isInverted}
          onClick={handleOpen}
          color={color}
        />

        <Portal onClose={handleClose} open={open}>
          <Segment
            style={{
              position: "fixed",
              // Keep it fixed so it stays in place even if the page is scrolled
              top: "25%",
              // Align the top of the segment with the top of the viewport
              left: "50%",
              // Center the segment horizontally
              transform: "translateX(-50%)",
              // Shift the segment left by 50% of its width
              zIndex: 1000,
              // Ensure it's on top of other elements
              width: "50%",
              height: "auto",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              // Correct the property name to justifyContent
            }}
          >
            <Header>
              <Grid columns={3}>
                <GridColumn align="left"></GridColumn>
                <GridColumn align="middle">{header}</GridColumn>
                <GridColumn align="right">
                  <Icon
                    name="close"
                    onClick={handleClose}
                    style={{ cursor: "pointer" }}
                    color="black"
                  />
                </GridColumn>
              </Grid>
            </Header>
            <Container style={{ width: "100%", margin: "auto" }}>
              {enhancedChildren}
            </Container>
            <br />
          </Segment>
        </Portal>
      </GridColumn>
    </Grid>
  );
};

export default IsPortal;
