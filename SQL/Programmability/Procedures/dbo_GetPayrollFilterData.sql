SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO


CREATE PROCEDURE [dbo].[GetPayrollFilterData]-- GetPayrollFilterData 3,'1','','',''
(
@ProdId int,
@CID varchar(50),
@Date1 date,
@Date2 date,
@InvoiceNo varchar(50),
@Mode int
)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	
	 if(@Date1='')
	 begin
	 set @Date1='0001-01-01'
	 end

	  if(@Date2='')
	 begin
	 set @Date2='9999-01-01'
	 end


   if(@Mode=1)
   begin
	select I.PayrollFileID,i.LoadNumber from PayrollFile I	
	where I.ProdID=@prodId 
	and (i.InvoiceNumber=@InvoiceNo  OR @InvoiceNo = '') and i.StartDate between @Date1 and @Date2 
	and (i.CompanyID=@CID  OR @CID = '')  and I.Status='Load'
	 order by i.PayrollFileID   


	 end
	 else
	 begin
	 select I.PayrollFileID,i.LoadNumber from PayrollFile I	
	where I.ProdID=@prodId 
	and (i.InvoiceNumber=@InvoiceNo  OR @InvoiceNo = '') and i.StartDate between @Date1 and @Date2 
	and (i.CompanyID=@CID  OR @CID = '')  and I.Status='Post'
	 order by i.PayrollFileID  
	 end

END 






GO