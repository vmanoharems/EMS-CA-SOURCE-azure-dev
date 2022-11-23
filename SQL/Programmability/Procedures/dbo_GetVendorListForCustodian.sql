SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

CREATE PROCEDURE [dbo].[GetVendorListForCustodian] -- GetVendorListForCustodian 3
	-- Add the parameters for the stored procedure here
	@ProdId int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

select  VendorID,VendorName from tblvendor where prodid=@prodid and status=1 and vendorid not in (select vendorid from custodian where prodid=@prodid)
	and Type='Petty Cash'
END



GO