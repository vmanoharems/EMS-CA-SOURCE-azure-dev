SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

CREATE PROCEDURE [dbo].[GetCompanyDetailForAccount] 
	-- Add the parameters for the stored procedure here
	@ProdId int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	select AccountCode,AccountName,1 as CheckB from TblAccounts where SegmentType='Company' and ProdId=@ProdId union 

select CompanyCode as AccountCode,CompanyName as AccountName,0 as CheckB from Company where CompanyCode not in 

(select AccountCode from TblAccounts where SegmentType='Company'  and ProdId=@ProdId)  and ProdId=@ProdId order by CheckB desc
END



GO