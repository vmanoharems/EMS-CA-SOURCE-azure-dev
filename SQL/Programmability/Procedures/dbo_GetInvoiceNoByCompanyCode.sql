SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO



CREATE PROCEDURE [dbo].[GetInvoiceNoByCompanyCode] -- GetInvoiceNoByCompanyCode '07'
	-- Add the parameters for the stored procedure here
	@companyCode nvarchar(50) 
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
declare 	@InvoiceNo int,@CompanyId int,@AccountId int,@AccountCode nvarchar(50)

set @CompanyId=(select companyid from Company where CompanyCode=@companyCode)
    -- Insert statements for procedure here
	if exists( select * from  Invoice where CompanyID=@CompanyId)
	begin
	set @InvoiceNo=0;--(select top 1(InvoiceNumber+1)from  Invoice where CompanyID=@CompanyId order by 1 desc)
	end
	else
	begin
	set @InvoiceNo=0;
	end

	set @AccountId= (select AccountId  from coa where SS1=@companyCode and ss2='' )
set @AccountCode= (select ss1 from coa where ss1=@companyCode and ss2='')
	select @InvoiceNo as InvoiceNo,isnull(@AccountId,0) as COAId,isnull(@AccountCode,0) as COACode,@CompanyId as CompanyId;
END





GO