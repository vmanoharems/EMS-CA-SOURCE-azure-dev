SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

--[ParseXML] '<Customers><Customer Id ="1"><Name>JohnHammond</Name><Country>UnitedStates</Country></Customer><Customer Id ="2"><Name>MudassarKhan</Name><Country>India</Country></Customer><Customer Id ="3"><Name>SuzanneMathews</Name><Country>France</Country></Customer><Customer Id ="4"><Name>RobertSchidner</Name><Country>Russia</Country></Customer></Customers>'
CREATE PROCEDURE [dbo].[InsertXML] 
@xml XML
AS
BEGIN
	SET NOCOUNT ON;

	INSERT INTO CustomerDetails
    SELECT 
	Customer.value('@Id','INT') AS Id, --ATTRIBUTE 
	Customer.value('(Name/text())[1]','VARCHAR(100)') AS Name, --TAG 
	Customer.value('(Country/text())[1]','VARCHAR(100)') AS Country --TAG 
	FROM
	@xml.nodes('/Customers/Customer')AS TEMPTABLE(Customer)
END





GO