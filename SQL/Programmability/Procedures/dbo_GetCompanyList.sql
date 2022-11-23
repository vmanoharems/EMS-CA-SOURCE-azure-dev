SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
CREATE PROCEDURE [dbo].[GetCompanyList]
(
@ProdId int
)
AS
BEGIN
 -- SET NOCOUNT ON added to prevent extra result sets from
 -- interfering with SELECT statements.
 SET NOCOUNT ON;

 select CompanyID,CompanyName,CompanyCode from Company where ProdID=@ProdId

END





GO