SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

CREATE PROCEDURE [dbo].[GetCompanylistReport]  --- GetCompanylistReport 3
	
@ProdID int
AS
BEGIN

	SET NOCOUNT ON;

	SELECT C.CompanyID,C.CompanyName,C.Address1,C.CompanyPhone,C.Contact,T.StateID,T.StatetaxID,T.taxinfoID,C.Status From Company C inner join taxinfo T  on C.ProdID=@ProdID and C.CompanyID= T.CompanyID
END



GO