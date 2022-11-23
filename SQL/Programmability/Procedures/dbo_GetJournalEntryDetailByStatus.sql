SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

CREATE PROCEDURE [dbo].[GetJournalEntryDetailByStatus]
	-- Add the parameters for the stored procedure here
	@ProdId int,
	@StartTransaction int,
	@EndTransaction int
	--,@ThirdParty bit,
	--@VendorName nvarchar(50)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
select  JournalEntryId,TransactionNumber,'-' as CO, isnull(DebitTotal,0) as DebitTotal,ISNULL(CreditTotal,0) as CreditTotal, isnull(TotalLines,0)as TotalLines  ,'-' as Vendor, '-' as ThridParty,CONVERT(VARCHAR(11),je.PostedDate,106) as PostedDate From JournalEntry  JE

	 where JE.ProdId=@ProdId and je.AuditStatus='Posted' and cast(je.TransactionNumber  as int) BETWEEN @StartTransaction AND @EndTransaction
--	and (jed.ThirdParty =@ThirdParty or ThirdParty=0)
	  --and (jed.VendorName  LIKE @VendorName + '%' OR @VendorName = '')
END



/****** Object:  StoredProcedure [dbo].[GeteverseJEDetail]    Script Date: 05/10/2016 5:28:44 PM ******/
SET ANSI_NULLS ON



GO