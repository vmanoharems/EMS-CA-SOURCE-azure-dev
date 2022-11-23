SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
CREATE PROCEDURE [dbo].[GetPONumberForCompany] -- GetPONumberForCompany 'AC'
	-- Add the parameters for the stored procedure here
	@companyCode nvarchar(20)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	declare @Count int,@PONumber varchar(50),
	@AccountId int,@AccountCode nvarchar(50),@CompanyId int

	set @CompanyId=(select   CompanyID from Company where CompanyCode=@companyCode) 
set @count =(select count(*) from PurchaseOrder where CompanyID=@companyId)
if(@Count=0)
begin
set @PONumber= (select PO From StartingValue where CompanyID=@companyId)
end
else
begin
set @PONumber= 0--(select (max(PONumber)+1) from PurchaseOrder where CompanyID=@companyId)
end

set @AccountId= (select AccountId  from coa where SS1=@companyCode and ss2='' )
set @AccountCode= (select ss1 from coa where ss1=@companyCode and ss2='')
select @PONumber as  PONumber,isnull(@AccountId,0) as COAId,isnull(@AccountCode,0) as COACode;
END





GO